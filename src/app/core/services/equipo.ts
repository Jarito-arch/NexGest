import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Rol = 'Propietario' | 'Empleado';

export interface Miembro {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  estado: 'Activo' | 'Invitación pendiente';
  /** Claves de los módulos a los que el propietario le dio acceso (ver `MODULOS_BASE` y `custom:<id>`). */
  modulos: string[];
}

export interface ModuloAcceso {
  clave: string;
  nombre: string;
  icono: string;
}

/** Módulos del sistema sobre los que el propietario puede dar acceso a un empleado. */
export const MODULOS_BASE: ModuloAcceso[] = [
  { clave: 'ventas', nombre: 'Ventas', icono: 'bi-cart3' },
  { clave: 'inventario', nombre: 'Inventario', icono: 'bi-box-seam' },
  { clave: 'finanzas', nombre: 'Finanzas', icono: 'bi-cash-stack' },
  { clave: 'clientes', nombre: 'Clientes', icono: 'bi-people' },
  { clave: 'proveedores', nombre: 'Proveedores', icono: 'bi-truck' },
];

const STORAGE_KEY = 'nexgest-equipo';

/** Personas del equipo (simulado en localStorage). El propietario no se guarda: es quien tiene la sesión. */
@Service()
export class Equipo {
  private platformId = inject(PLATFORM_ID);

  readonly extras = signal<Miembro[]>(this.cargar());

  agregar(miembro: Miembro): void {
    this.guardar([...this.extras(), miembro]);
  }

  cambiarModulos(id: string, modulos: string[]): void {
    this.guardar(this.extras().map((m) => (m.id === id ? { ...m, modulos } : m)));
  }

  quitar(id: string): void {
    this.guardar(this.extras().filter((m) => m.id !== id));
  }

  /** Quita un módulo personalizado eliminado de los accesos de todos los empleados. */
  revocarModulo(clave: string): void {
    this.guardar(this.extras().map((m) => ({ ...m, modulos: m.modulos.filter((c) => c !== clave) })));
  }

  private guardar(lista: Miembro[]): void {
    this.extras.set(lista);
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      // Sigue funcionando en memoria.
    }
  }

  private cargar(): Miembro[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(data)) return [];
      // Equipos guardados con los roles anteriores (Administrador, Editor, Solo lectura) pasan a ser empleados.
      return (data as Partial<Miembro>[]).map((m) => ({
        id: String(m.id ?? `m${Date.now()}`),
        nombre: String(m.nombre ?? ''),
        correo: String(m.correo ?? ''),
        rol: 'Empleado' as Rol,
        estado: m.estado === 'Activo' ? 'Activo' : 'Invitación pendiente',
        modulos: Array.isArray(m.modulos) ? m.modulos : MODULOS_BASE.map((x) => x.clave),
      }));
    } catch {
      return [];
    }
  }
}

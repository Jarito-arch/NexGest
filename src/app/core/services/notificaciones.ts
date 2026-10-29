import { Service, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Aviso {
  id: string;
  titulo: string;
  detalle: string;
  icono: string;
  /** Texto de tiempo ya formateado (los datos son simulados). */
  cuando: string;
  /** Pantalla a la que lleva el aviso. */
  ruta?: string;
  leido: boolean;
}

const STORAGE_KEY = 'nexgest-notificaciones-leidas';

const AVISOS: Omit<Aviso, 'leido'>[] = [
  { id: 'stock-k2', titulo: 'Stock agotado: Teclado inalámbrico K2', detalle: 'Ya no quedan unidades. Repón para no perder ventas.', icono: 'bi-box-seam', cuando: 'Hace 20 min', ruta: '/inventario' },
  { id: 'factura-1042', titulo: 'La factura #F-1042 vence mañana', detalle: 'Revisa el pago pendiente para evitar recargos.', icono: 'bi-receipt', cuando: 'Hace 2 h', ruta: '/finanzas' },
  { id: 'stock-bajo', titulo: '5 productos están bajo el mínimo', detalle: 'Te conviene reponerlos esta semana.', icono: 'bi-exclamation-triangle', cuando: 'Hoy, 8:30', ruta: '/inventario' },
  { id: 'cierre-caja', titulo: 'Cierre de caja pendiente de revisión', detalle: 'El cierre de ayer aún no fue confirmado.', icono: 'bi-cash-stack', cuando: 'Ayer', ruta: '/finanzas' },
  { id: 'clientes-inactivos', titulo: '14 clientes frecuentes no compran hace 3 semanas', detalle: 'Contáctalos con una oferta con fecha límite.', icono: 'bi-people', cuando: 'Ayer', ruta: '/clientes' },
  { id: 'bienvenida', titulo: 'Tu plan de acción está listo', detalle: 'Sigue la línea de tiempo para llevar tu negocio al siguiente nivel.', icono: 'bi-signpost-split', cuando: 'Hace 2 días', ruta: '/planAccion' },
];

/** Avisos simulados. Solo se guarda en localStorage cuáles ya se leyeron. */
@Service()
export class Notificaciones {
  private platformId = inject(PLATFORM_ID);

  private leidos = signal<string[]>(this.cargar());

  readonly avisos = computed<Aviso[]>(() => AVISOS.map((a) => ({ ...a, leido: this.leidos().includes(a.id) })));
  readonly sinLeer = computed(() => this.avisos().filter((a) => !a.leido).length);

  marcarLeido(id: string): void {
    if (this.leidos().includes(id)) return;
    this.guardar([...this.leidos(), id]);
  }

  marcarTodos(): void {
    this.guardar(AVISOS.map((a) => a.id));
  }

  private guardar(ids: string[]): void {
    this.leidos.set(ids);
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Si no se puede guardar, el estado sigue en memoria.
    }
  }

  private cargar(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(data) ? data.filter((i): i is string => typeof i === 'string') : [];
    } catch {
      return [];
    }
  }
}

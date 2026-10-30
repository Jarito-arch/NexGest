import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Equipo, MODULOS_BASE, Miembro, ModuloAcceso } from '../../core/services/equipo';
import { Tenant } from '../../core/services/tenant';

@Component({
  selector: 'app-team-management',
  styleUrl: './team-management.css',
  templateUrl: './team-management.html',
})
export class TeamManagement {
  private auth = inject(Auth);
  private equipo = inject(Equipo);
  private tenant = inject(Tenant);

  /** Módulos que se pueden habilitar: los del sistema y los que el propietario creó. */
  readonly modulosDisponibles = computed<ModuloAcceso[]>(() => [
    ...MODULOS_BASE,
    ...this.tenant.customModules().map((m) => ({ clave: `custom:${m.id}`, nombre: m.nombre, icono: m.icono })),
  ]);

  readonly miembros = computed<Miembro[]>(() => [
    {
      id: 'owner',
      nombre: this.auth.userName() || 'Tú',
      correo: this.auth.userEmail() || 'Sin correo',
      rol: 'Propietario',
      estado: 'Activo',
      modulos: [],
    },
    ...this.equipo.extras(),
  ]);

  correo = signal('');
  /** Módulos marcados para la próxima invitación (por defecto, ninguno). */
  modulosNuevos = signal<string[]>([]);
  error = signal('');
  aviso = signal('');

  escribirCorreo(event: Event): void {
    this.correo.set((event.target as HTMLInputElement).value);
  }

  alternarNuevo(clave: string): void {
    this.modulosNuevos.update((lista) => (lista.includes(clave) ? lista.filter((c) => c !== clave) : [...lista, clave]));
  }

  invitar(event: Event): void {
    event.preventDefault();
    const correo = this.correo().trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      this.error.set('Ingresa un correo válido');
      return;
    }
    if (this.miembros().some((m) => m.correo.toLowerCase() === correo)) {
      this.error.set('Esa persona ya está en tu equipo');
      return;
    }
    if (!this.modulosNuevos().length) {
      this.error.set('Elige al menos un módulo al que pueda acceder');
      return;
    }
    this.error.set('');
    const nombre = correo.split('@')[0].split(/[._-]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
    this.equipo.agregar({
      id: `m${Date.now()}`,
      nombre,
      correo,
      rol: 'Empleado',
      estado: 'Invitación pendiente',
      modulos: this.modulosNuevos(),
    });
    this.correo.set('');
    this.modulosNuevos.set([]);
    this.mostrarAviso(`Invitación enviada a ${correo} (simulada). Podrá entrar con ese correo como empleado.`);
  }

  alternarModulo(miembro: Miembro, clave: string): void {
    const modulos = miembro.modulos.includes(clave) ? miembro.modulos.filter((c) => c !== clave) : [...miembro.modulos, clave];
    this.equipo.cambiarModulos(miembro.id, modulos);
  }

  quitar(id: string): void {
    this.equipo.quitar(id);
  }

  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    return ((partes[0]?.[0] ?? '?') + (partes[1]?.[0] ?? '')).toUpperCase();
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 4500);
  }
}

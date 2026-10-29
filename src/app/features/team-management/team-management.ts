import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';

export type Rol = 'Propietario' | 'Administrador' | 'Editor' | 'Solo lectura';

interface Miembro {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  estado: 'Activo' | 'Invitación pendiente';
}

const STORAGE_KEY = 'nexgest-equipo';

@Component({
  imports: [FormsModule],
  selector: 'app-team-management',
  styleUrl: './team-management.css',
  templateUrl: './team-management.html',
})
export class TeamManagement {
  private auth = inject(Auth);
  private platformId = inject(PLATFORM_ID);

  readonly roles: Rol[] = ['Administrador', 'Editor', 'Solo lectura'];

  /** Miembros agregados o invitados por el usuario (simulado; el propietario se arma desde la sesión). */
  private extras = signal<Miembro[]>(this.cargar());

  readonly miembros = computed<Miembro[]>(() => [
    {
      id: 'owner',
      nombre: this.auth.userName() || 'Tú',
      correo: this.auth.userEmail() || 'Sin correo',
      rol: 'Propietario',
      estado: 'Activo',
    },
    ...this.extras(),
  ]);

  correo = signal('');
  rol = signal<Rol>('Editor');
  error = signal('');
  aviso = signal('');

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
    this.error.set('');
    const nombre = correo.split('@')[0].split(/[._-]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
    this.guardar([...this.extras(), { id: `m${Date.now()}`, nombre, correo, rol: this.rol(), estado: 'Invitación pendiente' }]);
    this.correo.set('');
    this.mostrarAviso(`Invitación enviada a ${correo} (simulada).`);
  }

  cambiarRol(id: string, rol: string): void {
    this.guardar(this.extras().map((m) => (m.id === id ? { ...m, rol: rol as Rol } : m)));
  }

  quitar(id: string): void {
    this.guardar(this.extras().filter((m) => m.id !== id));
  }

  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    return ((partes[0]?.[0] ?? '?') + (partes[1]?.[0] ?? '')).toUpperCase();
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
      return Array.isArray(data) ? (data as Miembro[]) : [];
    } catch {
      return [];
    }
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 3500);
  }
}

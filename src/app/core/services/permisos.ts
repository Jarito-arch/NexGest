import { Service, computed, inject } from '@angular/core';
import { Auth } from './auth';
import { Equipo, Rol } from './equipo';

/**
 * Qué puede hacer quien tiene la sesión.
 * - Propietario: todo (ver, registrar, editar, eliminar, equipo, configuración y crear módulos).
 * - Empleado: solo ver y registrar datos en los módulos que el propietario le habilitó.
 * Quien inicia sesión con el correo de un empleado invitado entra como empleado; cualquier otra cuenta es propietaria.
 */
@Service()
export class Permisos {
  private auth = inject(Auth);
  private equipo = inject(Equipo);

  private readonly miembro = computed(() => {
    const correo = this.auth.userEmail().trim().toLowerCase();
    return correo ? this.equipo.extras().find((m) => m.correo.toLowerCase() === correo) : undefined;
  });

  readonly rol = computed<Rol>(() => this.miembro()?.rol ?? 'Propietario');
  readonly esPropietario = computed(() => this.rol() === 'Propietario');

  /** Editar o eliminar registros: solo el propietario. */
  readonly puedeEditar = this.esPropietario;

  /** El dashboard es de lectura para todos; el resto depende de los módulos habilitados. */
  puedeVer(clave: string): boolean {
    if (this.esPropietario() || clave === 'dashboard') return true;
    return this.miembro()?.modulos.includes(clave) ?? false;
  }
}

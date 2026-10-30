import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permisos } from '../services/permisos';

/**
 * Protege una ruta según `data`:
 * - `{ modulo: 'ventas' }`: hace falta tener ese módulo habilitado.
 * - `{ moduloDinamico: true }`: la clave sale del parámetro `:id` (`custom:<id>`).
 * - `{ soloPropietario: true }`: solo el propietario.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const permisos = inject(Permisos);
  const router = inject(Router);

  let permitido = true;
  if (route.data['soloPropietario']) permitido = permisos.esPropietario();
  else if (route.data['moduloDinamico']) permitido = permisos.puedeVer(`custom:${route.paramMap.get('id')}`);
  else if (route.data['modulo']) permitido = permisos.puedeVer(route.data['modulo']);

  return permitido || router.createUrlTree(['/dashboard']);
};

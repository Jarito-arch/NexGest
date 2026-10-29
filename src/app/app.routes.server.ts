import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Solo la landing es pública y estática; el resto depende de la sesión (localStorage),
  // así que se renderiza en el navegador para que los guards lean la sesión real.
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client }
];

import { Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '../../../core/services/auth';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LongDatePipe } from '../../../shared/pipes/long-date-pipe';
import { Notificaciones } from '../../../core/services/notificaciones';


@Component({
  imports: [RouterLink, LongDatePipe],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly auth = inject(Auth);
  readonly avisos = inject(Notificaciones);

  /** Estado del menú lateral en móvil y evento para abrirlo/cerrarlo. */
  menuAbierto = input(false);
  menu = output<void>();

  fecha = new Date();

  titulo = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.obtenerTitulo())
    ),
    { initialValue: '' }
  );

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private obtenerTitulo(): string {
    let ruta: ActivatedRoute | null = this.route;
    let titulo = '';
    while (ruta) {
      const t = ruta.snapshot.data['title'];
      if (t) titulo = t;
      ruta = ruta.firstChild;
    }
    return titulo;
  }
}

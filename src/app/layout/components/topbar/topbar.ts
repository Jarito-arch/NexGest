import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LongDatePipe } from '../../../shared/pipes/long-date-pipe';


@Component({
  imports: [RouterLink, LongDatePipe],
  selector: 'app-topbar',
  styleUrl: './topbar.css',
  templateUrl: './topbar.html',
})
export class Topbar {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  fecha = new Date();

  titulo = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.obtenerTitulo())
    ),
    { initialValue: '' }
  );

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

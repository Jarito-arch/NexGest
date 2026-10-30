import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '../../../core/services/auth';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { LongDatePipe } from '../../../shared/pipes/long-date-pipe';
import { OnboardingService } from '../../../core/services/onboarding-state';
import { Permisos } from '../../../core/services/permisos';


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
  readonly permisos = inject(Permisos);
  private readonly negocio = inject(OnboardingService);

  /** Iniciales del negocio ("Café Aurora" → "CA"); si aún no tiene nombre, las de la persona. */
  readonly iniciales = computed(() => {
    const palabras = this.negocio.businessName().trim().split(/\s+/).filter(Boolean);
    if (!palabras.length) return this.auth.initials();
    return (palabras[0][0] + (palabras[1]?.[0] ?? palabras[0][1] ?? '')).toUpperCase();
  });

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

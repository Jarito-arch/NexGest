import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notificaciones as NotificacionesService } from '../../core/services/notificaciones';

@Component({
  imports: [RouterLink],
  selector: 'app-notificaciones',
  styleUrl: './notificaciones.css',
  templateUrl: './notificaciones.html',
})
export class Notificaciones {
  readonly servicio = inject(NotificacionesService);

  filtro = signal<'todas' | 'sin-leer'>('todas');

  readonly visibles = computed(() =>
    this.filtro() === 'sin-leer' ? this.servicio.avisos().filter((a) => !a.leido) : this.servicio.avisos(),
  );
}

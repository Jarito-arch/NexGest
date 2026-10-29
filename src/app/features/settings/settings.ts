import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { OnboardingService } from '../../core/services/onboarding-state';

const PREFS_KEY = 'nexgest-preferencias';

@Component({
  imports: [FormsModule],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
  readonly auth = inject(Auth);
  private onboarding = inject(OnboardingService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly categorias = ['Alimentos y bebidas', 'Comercio', 'Servicios', 'Manufactura', 'Tecnología', 'Otro'];
  readonly equipos = ['Solo yo', '2 - 5 personas', '6 - 10 personas', 'Más de 10'];

  // Datos del negocio, precargados desde el onboarding.
  nombre = signal(this.onboarding.businessName());
  categoria = signal(this.onboarding.category());
  equipo = signal(this.onboarding.teamSize());

  // Preferencias básicas.
  avisosCorreo = signal(true);
  resumenSemanal = signal(true);
  moneda = signal('PEN');

  errorNombre = signal('');
  aviso = signal('');

  constructor() {
    this.cargarPreferencias();
  }

  guardarNegocio(event: Event): void {
    event.preventDefault();
    if (!this.nombre().trim()) {
      this.errorNombre.set('Escribe el nombre de tu negocio');
      return;
    }
    this.errorNombre.set('');
    this.onboarding.businessName.set(this.nombre().trim());
    this.onboarding.category.set(this.categoria());
    this.onboarding.teamSize.set(this.equipo());
    this.mostrarAviso('Datos del negocio guardados.');
  }

  guardarPreferencias(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(
          PREFS_KEY,
          JSON.stringify({ avisosCorreo: this.avisosCorreo(), resumenSemanal: this.resumenSemanal(), moneda: this.moneda() }),
        );
      } catch {
        // Si no se puede guardar, las preferencias siguen activas en esta sesión.
      }
    }
    this.mostrarAviso('Preferencias guardadas.');
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private cargarPreferencias(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const data = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null') as Record<string, unknown> | null;
      if (!data) return;
      if (typeof data['avisosCorreo'] === 'boolean') this.avisosCorreo.set(data['avisosCorreo']);
      if (typeof data['resumenSemanal'] === 'boolean') this.resumenSemanal.set(data['resumenSemanal']);
      if (typeof data['moneda'] === 'string') this.moneda.set(data['moneda']);
    } catch {
      // Preferencias corruptas: se usan los valores por defecto.
    }
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 3000);
  }
}

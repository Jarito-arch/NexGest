import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../../layout/auth-layout/auth-layout';
import { AuthCardComponent } from '../../../../shared/components/auth-card/auth-card';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button';
import { Auth } from '../../../../core/services/auth';
import { OnboardingService } from '../../../../core/services/onboarding-state';
import { PlanAccion } from '../../../../core/services/plan-accion';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    AuthLayoutComponent,
    AuthCardComponent,
    FormFieldComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private auth = inject(Auth);
  private onboarding = inject(OnboardingService);
  private plan = inject(PlanAccion);
  private router = inject(Router);

  name = '';
  email = this.auth.draftEmail();
  password = '';

  loading = signal(false);
  serverError = signal('');
  errors = signal({ name: '', email: '', password: '' });

  submit(event: Event): void {
    event.preventDefault();
    if (this.loading()) return;

    const errors = {
      name: this.name.trim() ? '' : 'Ingresa tu nombre',
      email: /^\S+@\S+\.\S+$/.test(this.email.trim()) ? '' : 'Ingresa un correo válido',
      password: this.password.length >= 6 ? '' : 'Mínimo 6 caracteres',
    };
    this.errors.set(errors);
    if (errors.name || errors.email || errors.password) return;

    this.onboarding.reset();
    this.plan.reiniciar();
    this.auth.signup(this.name, this.email);
    this.router.navigate(['/onboarding/step1']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../shared/components/auth-layout-component/auth-layout-component';
import { AuthCardComponent } from '../../shared/components/auth-card-component/auth-card-component';
import { FormFieldComponent } from '../../shared/components/form-field-component/form-field-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';
import { AuthService } from '../../core/auth.service';

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
  private auth = inject(AuthService);
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

    this.loading.set(true);
    this.serverError.set('');

    this.auth
      .register({ name: this.name.trim(), email: this.email.trim(), password: this.password })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.ok) this.router.navigate(['/onboarding/step1']);
          else this.serverError.set(res.message ?? 'No se pudo crear la cuenta');
        },
        error: () => {
          this.loading.set(false);
          this.serverError.set('Ocurrió un error. Inténtalo de nuevo.');
        },
      });
  }
}

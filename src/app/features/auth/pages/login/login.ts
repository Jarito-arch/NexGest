import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../shared/components/auth-layout-component/auth-layout-component';
import { AuthCardComponent } from '../../shared/components/auth-card-component/auth-card-component';
import { FormFieldComponent } from '../../shared/components/form-field-component/form-field-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    AuthLayoutComponent,
    AuthCardComponent,
    FormFieldComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  serverError = signal('');
  errors = signal({ email: '', password: '' });

  submit(event: Event): void {
    event.preventDefault();
    if (this.loading()) return;

    const errors = {
      email: /^\S+@\S+\.\S+$/.test(this.email.trim()) ? '' : 'Ingresa un correo válido',
      password: this.password ? '' : 'Ingresa tu contraseña',
    };
    this.errors.set(errors);
    if (errors.email || errors.password) return;

    this.loading.set(true);
    this.serverError.set('');

    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.ok) this.router.navigate(['/dashboard']);
        else this.serverError.set(res.message ?? 'No se pudo iniciar sesión');
      },
      error: () => {
        this.loading.set(false);
        this.serverError.set('Ocurrió un error. Inténtalo de nuevo.');
      },
    });
  }
}

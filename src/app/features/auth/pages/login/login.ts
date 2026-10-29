import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from '../../../../layout/auth-layout/auth-layout';
import { AuthCardComponent } from '../../../../shared/components/auth-card/auth-card';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button';
import { Auth } from '../../../../core/services/auth';

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
  private auth = inject(Auth);
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

    this.auth.login();
    this.router.navigate(['/dashboard']);
  }
}

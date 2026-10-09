import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
}

/**
 * Servicio de autenticación (STUB).
 * Reemplazar el cuerpo de login() / register() por llamadas HttpClient
 * cuando exista la API. La firma (Observable<AuthResponse>) ya está lista.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Correo capturado en la landing para precargarlo en /signup */
  readonly draftEmail = signal('');

  login(_payload: LoginPayload): Observable<AuthResponse> {
    // TODO: return this.http.post<AuthResponse>('/api/auth/login', payload);
    return of({ ok: true }).pipe(delay(500));
  }

  register(_payload: SignupPayload): Observable<AuthResponse> {
    // TODO: return this.http.post<AuthResponse>('/api/auth/register', payload);
    return of({ ok: true }).pipe(delay(500));
  }
}

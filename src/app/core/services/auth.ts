import { Service, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class Auth {
  private platformId = inject(PLATFORM_ID);

  /** Correo escrito en la landing, para precargarlo en el signup. */
  draftEmail = signal('');

  /** Datos del usuario con sesión (se guardan en localStorage y se borran al cerrar sesión). */
  userName = signal('');
  userEmail = signal('');

  /** Iniciales para el avatar de la topbar (por ejemplo "MC"). */
  initials = computed(() => {
    const partes = this.userName().trim().split(/\s+/).filter(Boolean);
    if (partes.length) return (partes[0][0] + (partes[1]?.[0] ?? partes[0][1] ?? '')).toUpperCase();
    return this.userEmail().trim().slice(0, 2).toUpperCase() || 'NG';
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.userName.set(localStorage.getItem('userName') ?? '');
      this.userEmail.set(localStorage.getItem('userEmail') ?? '');
    }
  }

  private get = (key: string) =>
    isPlatformBrowser(this.platformId) ? localStorage.getItem(key) === 'true' : false;

  private set = (key: string, value: boolean) => {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(key, String(value));
  };

  isLoggedIn()      { return this.get('isLoggedIn'); }
  isOnboardingDone() { return this.get('onboardingDone'); }

  signup(name = '', email = '') {
    this.set('isLoggedIn', true);
    this.set('onboardingDone', false);
    this.saveUser(name.trim(), email.trim());
  }

  login(email = '') {
    this.set('isLoggedIn', true);
    this.set('onboardingDone', true);
    const correo = email.trim();
    if (correo) this.saveUser(this.userName() || this.nameFromEmail(correo), correo);
  }

  completeOnboarding() { this.set('onboardingDone', true); }

  logout() {
    this.set('isLoggedIn', false);
    this.set('onboardingDone', false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
    this.userName.set('');
    this.userEmail.set('');
  }

  private saveUser(name: string, email: string) {
    this.userName.set(name);
    this.userEmail.set(email);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
    }
  }

  /** Sin backend no hay nombre real al iniciar sesión: se deduce del correo ("ana.perez@..." → "Ana Perez"). */
  private nameFromEmail(email: string): string {
    return email
      .split('@')[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
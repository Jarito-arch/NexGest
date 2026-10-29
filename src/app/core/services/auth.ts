import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Service()
export class Auth {
  private platformId = inject(PLATFORM_ID);

  /** Correo escrito en la landing, para precargarlo en el signup. */
  draftEmail = signal('');

  private get = (key: string) =>
    isPlatformBrowser(this.platformId) ? localStorage.getItem(key) === 'true' : false;

  private set = (key: string, value: boolean) => {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem(key, String(value));
  };

  isLoggedIn()      { return this.get('isLoggedIn'); }
  isOnboardingDone() { return this.get('onboardingDone'); }

  signup() { this.set('isLoggedIn', true); this.set('onboardingDone', false); }

  login() { this.set('isLoggedIn', true); this.set('onboardingDone', true); }

  completeOnboarding() { this.set('onboardingDone', true); }

  logout() { this.set('isLoggedIn', false); this.set('onboardingDone', false); }
}
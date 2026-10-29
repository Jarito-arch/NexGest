import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  if (!auth.isOnboardingDone()) return router.createUrlTree(['/onboarding']);
  return true;
};

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/signup']);
  if (auth.isOnboardingDone()) return router.createUrlTree(['/dashboard']);
  return true;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  return router.createUrlTree([auth.isOnboardingDone() ? '/dashboard' : '/onboarding']);
};
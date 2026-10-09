import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Onboarding } from './pages/onboarding/onboarding';
import { OnboardingStep2 } from './pages/onboarding-step2/onboarding-step2';
import { OnboardingStep3 } from './pages/onboarding-step3/onboarding-step3';
import { OnboardingStep4 } from './pages/onboarding-step4/onboarding-step4';
import { OnboardingStep5 } from './pages/onboarding-step5/onboarding-step5';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  { path: 'onboarding', redirectTo: 'onboarding/step1', pathMatch: 'full' },
  { path: 'onboarding/step1', component: Onboarding },
  { path: 'onboarding/step2', component: OnboardingStep2 },
  { path: 'onboarding/step3', component: OnboardingStep3 },
  { path: 'onboarding/step4', component: OnboardingStep4 },
  { path: 'onboarding/step5', component: OnboardingStep5 },

  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' },
];

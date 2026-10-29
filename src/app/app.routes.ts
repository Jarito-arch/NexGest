import { Routes } from '@angular/router';
import { authGuard, onboardingGuard, guestGuard } from './core/guards/auth-guard';

import { Landing } from './features/landing/landing';
import { Login } from './features/auth/pages/login/login';
import { Signup } from './features/auth/pages/signup/signup';
import { Onboarding } from './features/onboarding/onboarding';
import { OnboardingStep2 } from './features/onboarding/step2/onboarding-step2';
import { OnboardingStep3 } from './features/onboarding/step3/onboarding-step3';
import { OnboardingStep4 } from './features/onboarding/step4/onboarding-step4';
import { OnboardingStep5 } from './features/onboarding/step5/onboarding-step5';

import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Clientes } from './features/clientes/clientes';
import { Finanzas } from './features/finanzas/finanzas';
import { Ventas } from './features/ventas/ventas';
import { Proveedores } from './features/proveedores/proveedores';
import { Inventario } from './features/inventario/inventario';
import { CustomModules } from './features/custom-modules/custom-modules';

export const routes: Routes = [
  // Públicas
  { path: '', component: Landing, pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'signup', component: Signup, canActivate: [guestGuard] },

  // Onboarding
  {
    path: 'onboarding',
    canActivate: [onboardingGuard],
    children: [
      { path: '', redirectTo: 'step1', pathMatch: 'full' },
      { path: 'step1', component: Onboarding },
      { path: 'step2', component: OnboardingStep2 },
      { path: 'step3', component: OnboardingStep3 },
      { path: 'step4', component: OnboardingStep4 },
      { path: 'step5', component: OnboardingStep5 },
    ],
  },

  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },
      { path: 'clientes', component: Clientes, data: { title: 'Clientes' } },
      { path: 'finanzas', component: Finanzas, data: { title: 'Finanzas' } },
      { path: 'ventas', component: Ventas, data: { title: 'Ventas' } },
      { path: 'proveedores', component: Proveedores, data: { title: 'Proveedores' } },
      { path: 'inventario', component: Inventario, data: { title: 'Inventario' } },
      { path: 'custom-modules', component: CustomModules, data: { title: 'Nuevo Módulo' } },
    ],
  },

  { path: '**', redirectTo: '' },
];
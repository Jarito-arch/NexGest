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
import { PublicLayout } from './layout/public-layout/public-layout';
import { NotFound } from './features/not-found/not-found';
import { CentroInteligencia } from './features/centro-inteligencia/centro-inteligencia';
import { PlanAccion } from './features/plan-accion/plan-accion';
import { Settings } from './features/settings/settings';
import { TeamManagement } from './features/team-management/team-management';
import { Notificaciones } from './features/notificaciones/notificaciones';
import { CustomModuleDetail } from './features/custom-modules/custom-module-detail/custom-module-detail';

export const routes: Routes = [
  // Públicas
  {
    path: '',
    component: PublicLayout,
    children: [{ path: '', component: Landing, pathMatch: 'full', title: 'NexGest · Gestión inteligente para tu negocio' }],
  },
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'NexGest · Ingresar' },
  { path: 'signup', component: Signup, canActivate: [guestGuard], title: 'NexGest · Crear cuenta' },

  // Onboarding
  {
    path: 'onboarding',
    canActivate: [onboardingGuard],
    title: 'NexGest · Configura tu negocio',
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
      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' }, title: 'NexGest · Dashboard' },
      { path: 'clientes', component: Clientes, data: { title: 'Clientes' }, title: 'NexGest · Clientes' },
      { path: 'finanzas', component: Finanzas, data: { title: 'Finanzas' }, title: 'NexGest · Finanzas' },
      { path: 'ventas', component: Ventas, data: { title: 'Ventas' }, title: 'NexGest · Ventas' },
      { path: 'proveedores', component: Proveedores, data: { title: 'Proveedores' }, title: 'NexGest · Proveedores' },
      { path: 'inventario', component: Inventario, data: { title: 'Inventario' }, title: 'NexGest · Inventario' },
      { path: 'centroInteligencia', component: CentroInteligencia, data: { title: 'Centro de Inteligencia' }, title: 'NexGest · Centro de Inteligencia' },
      { path: 'planAccion', component: PlanAccion, data: { title: 'Plan de Acción' }, title: 'NexGest · Plan de Acción' },
      { path: 'configuracion', component: Settings, data: { title: 'Configuración' }, title: 'NexGest · Configuración' },
      { path: 'equipo', component: TeamManagement, data: { title: 'Equipo' }, title: 'NexGest · Equipo' },
      { path: 'notificacion', component: Notificaciones, data: { title: 'Notificaciones' }, title: 'NexGest · Notificaciones' },
      {
        path: 'custom-modules',
        children: [
          { path: '', component: CustomModules, data: { title: 'Nuevo Módulo' }, title: 'NexGest · Módulos' },
          // El título de la pestaña lo pone la propia pantalla con el nombre del módulo.
          { path: ':id', component: CustomModuleDetail, data: { title: 'Mi módulo' } },
        ],
      },
    ],
  },

  { path: '**', component: NotFound, title: 'NexGest · Página no encontrada' },
];
import { Routes } from '@angular/router';
import { authGuard, onboardingGuard, guestGuard } from './core/guards/auth-guard';
import { permissionGuard } from './core/guards/permission-guard';

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
      { path: 'clientes', component: Clientes, canActivate: [permissionGuard], data: { title: 'Clientes', modulo: 'clientes' }, title: 'NexGest · Clientes' },
      { path: 'finanzas', component: Finanzas, canActivate: [permissionGuard], data: { title: 'Finanzas', modulo: 'finanzas' }, title: 'NexGest · Finanzas' },
      { path: 'ventas', component: Ventas, canActivate: [permissionGuard], data: { title: 'Ventas', modulo: 'ventas' }, title: 'NexGest · Ventas' },
      { path: 'proveedores', component: Proveedores, canActivate: [permissionGuard], data: { title: 'Proveedores', modulo: 'proveedores' }, title: 'NexGest · Proveedores' },
      { path: 'inventario', component: Inventario, canActivate: [permissionGuard], data: { title: 'Inventario', modulo: 'inventario' }, title: 'NexGest · Inventario' },
      { path: 'centroInteligencia', component: CentroInteligencia, canActivate: [permissionGuard], data: { title: 'Centro de Inteligencia', soloPropietario: true }, title: 'NexGest · Centro de Inteligencia' },
      { path: 'planAccion', component: PlanAccion, canActivate: [permissionGuard], data: { title: 'Plan de Acción', soloPropietario: true }, title: 'NexGest · Plan de Acción' },
      { path: 'configuracion', component: Settings, canActivate: [permissionGuard], data: { title: 'Configuración', soloPropietario: true }, title: 'NexGest · Configuración' },
      { path: 'equipo', component: TeamManagement, canActivate: [permissionGuard], data: { title: 'Equipo', soloPropietario: true }, title: 'NexGest · Equipo' },
      { path: 'notificacion', component: Notificaciones, data: { title: 'Notificaciones' }, title: 'NexGest · Notificaciones' },
      {
        path: 'custom-modules',
        children: [
          { path: '', component: CustomModules, canActivate: [permissionGuard], data: { title: 'Nuevo Módulo', soloPropietario: true }, title: 'NexGest · Módulos' },
          // El título de la pestaña lo pone la propia pantalla con el nombre del módulo.
          { path: ':id', component: CustomModuleDetail, canActivate: [permissionGuard], data: { title: 'Mi módulo', moduloDinamico: true } },
        ],
      },
    ],
  },

  { path: '**', component: NotFound, title: 'NexGest · Página no encontrada' },
];

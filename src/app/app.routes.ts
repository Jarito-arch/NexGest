import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Clientes } from './features/clientes/clientes';
import { Finanzas } from './features/finanzas/finanzas';
import { Ventas } from './features/ventas/ventas';
import { Proveedores } from './features/proveedores/proveedores';
import { Inventario } from './features/inventario/inventario';
import { CustomModules } from './features/custom-modules/custom-modules';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: Dashboard,
        data: { title: 'Dashboard' }
    },

    {
        path: 'clientes',
        component: Clientes,
        data: { title: 'Clientes' }

    },

    {
        path: 'finanzas',
        component: Finanzas,
        data: { title: 'Finanzas' }
    },

    {
        path: 'ventas',
        component: Ventas,
        data: { title: 'Ventas' }
    },

    {
        path: 'proveedores',
        component: Proveedores,
        data: { title: 'Proveedores' }
    },
    {
        path: 'inventario',
        component: Inventario,
        data: { title: 'Inventario' }
    },
    {
        path: 'custom-modules',
        component: CustomModules,
        data: { title: 'Nuevo Módulo' }
    }
];

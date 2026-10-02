import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Clientes } from './pages/clientes/clientes';
import { Finanzas } from './pages/finanzas/finanzas';
import { Ventas } from './pages/ventas/ventas';
import { Proveedores } from './pages/proveedores/proveedores';
import { Inventario } from './pages/inventario/inventario';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: Dashboard
    },
    
    {
        path: 'clientes',
        component: Clientes
    },

    {
        path: 'finanzas',
        component: Finanzas
    },

    {
        path: 'ventas',
        component: Ventas
    },

    {
        path: 'proveedores',
        component: Proveedores
    },
    {
        path: 'inventario',
        component: Inventario
    }
];
import { Routes } from '@angular/router';
import { Clientes } from './pages/clientes/clientes';
import { Finanzas } from './pages/finanzas/finanzas';

export const routes: Routes = [
    {
        path: 'clientes',
        component: Clientes
    },

    {
        path: 'finanzas',
        component: Finanzas
    }

];
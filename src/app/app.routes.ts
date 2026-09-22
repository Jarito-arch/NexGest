import {Routes} from '@angular/router'; 
import {Ventas} from './pages/ventas/ventas';
import { Inventario } from './pages/inventario/inventario';
import { Proveedores } from './pages/proveedores/proveedores';
import { PlanAccion } from './pages/plan-accion/plan-accion';
import { Component } from '@angular/core';

export const routes: Routes = [
    {
        path: 'ventas', 
        component: Ventas
    },
    {
        path: 'inventario',
        component: Inventario
    }, 
    {
        path: 'proveedores',
        component: Proveedores
    },
    {
        path: 'plan-accion',
        component: PlanAccion
    }
]; 
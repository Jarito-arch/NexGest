import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  areas = [
    {
      nombre: 'Finanzas',
      valor: 78,
      estado: 'success'
    },
    {
      nombre: 'Ventas',
      valor: 84,
      estado: 'success'
    },
    {
      nombre: 'Inventario',
      valor: 61,
      estado: 'warning'
    },
    {
      nombre: 'Clientes',
      valor: 80,
      estado: 'success'
    },
    {
      nombre: 'Operaciones',
      valor: 76,
      estado: 'success'
    }
  ];

  kpis = [
    {
      titulo: 'Ventas del mes',
      valor: 'S/ 18,420',
      tendencia: '↑ 12%',
      tipo: 'up',
      descripcion: 'Por encima del promedio de los últimos 3 meses'
    },
    {
      titulo: 'Ganancia neta',
      valor: 'S/ 5,180',
      tendencia: '↑ 6%',
      tipo: 'up',
      descripcion: 'Margen del 28%, similar al mes anterior'
    },
    {
      titulo: 'Gastos',
      valor: 'S/ 13,240',
      tendencia: '↑ 12%',
      tipo: 'down',
      descripcion: 'Crecieron más rápido que las ventas'
    },
    {
      titulo: 'Flujo de caja',
      valor: 'S/ 9,860',
      tendencia: '↑ 4%',
      tipo: 'up',
      descripcion: 'Cubre 2.4 meses de gastos operativos'
    }
  ];

  alertas = [
    {
      tipo: 'risk',
      titulo: 'Café en grano (1kg)',
      texto: 'podría agotarse en 6 días',
      meta: 'Inventario · basado en el ritmo de venta actual'
    },
    {
      tipo: 'warn',
      titulo: 'Los gastos de publicidad',
      texto: 'subieron 22% este mes',
      meta: 'Finanzas · comparado con el promedio mensual'
    },
    {
      tipo: 'warn',
      titulo: '14 clientes frecuentes',
      texto: 'no compran hace más de 3 semanas',
      meta: 'Clientes · riesgo de inactividad'
    }
  ];

  recomendaciones = [
    {
      titulo: 'Revisar gastos de publicidad',
      prioridad: 'Prioridad alta',
      tipo: 'high',
      descripcion:
        'Las ventas bajaron 18% en las últimas 4 semanas mientras los gastos subieron 12%. La publicidad es el rubro que más creció sin un aumento equivalente en ventas.',
      accion: 'Ver desglose de gastos'
    },
    {
      titulo: 'Promocionar productos de mayor margen',
      prioridad: 'Oportunidad',
      tipo: 'med',
      descripcion:
        'Los clientes que compran "Cold Brew 500ml" gastan en promedio 32% más por visita que el resto. Aún no tiene promoción activa.',
      accion: 'Crear promoción'
    }
  ];

  planAccion = [
    {
      prioridad: 'Alta',
      tipo: 'high',
      texto: 'Reponer café en grano antes del viernes'
    },
    {
      prioridad: 'Alta',
      tipo: 'high',
      texto: 'Revisar y ajustar campaña de publicidad activa'
    },
    {
      prioridad: 'Media',
      tipo: 'med',
      texto: 'Contactar a los 14 clientes inactivos con una oferta'
    },
    {
      prioridad: 'Oportunidad',
      tipo: 'opp',
      texto: 'Lanzar promoción de Cold Brew 500ml'
    }
  ];

  marcarPlan(index: number): void {
    this.planAccion[index] = {
      ...this.planAccion[index],
      tipo: 'completed'
    };
  }
}
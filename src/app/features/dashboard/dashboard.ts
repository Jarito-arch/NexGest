import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatbot } from '../../core/services/chatbot';


@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})

export class Dashboard {
  private chatbot = inject(Chatbot);

  asistenteAbierto = false;
  consulta = '';
  consultando = false;
  mensajes: { autor: 'usuario' | 'asistente'; texto: string }[] = [
    { autor: 'asistente', texto: 'Hola. Puedo ayudarte a analizar ventas, gastos, inventario y clientes. ¿Qué decisión estás evaluando?' },
  ];

  periodo = 30;
  alertasVisibles = [
    'Stock agotado: Teclado inalámbrico K2',
    'Factura #F-1042 vence mañana',
    '5 productos bajo el mínimo',
    'Cierre de caja pendiente de revisión',
  ];
  get puntosGrafico(): { etiqueta: string; ventas: number; ingresos: number }[] {
    const base = this.periodo === 7
      ? [['Lun', 42, 32], ['Mar', 58, 40], ['Mié', 48, 37], ['Jue', 75, 54], ['Vie', 64, 49], ['Sáb', 92, 68], ['Dom', 70, 52]]
      : this.periodo === 30
        ? [['S1', 48, 35], ['S2', 65, 49], ['S3', 57, 42], ['S4', 88, 64]]
        : [['Ene', 42, 31], ['Feb', 55, 39], ['Mar', 49, 36], ['Abr', 68, 48], ['May', 61, 45], ['Jun', 78, 57], ['Jul', 72, 52], ['Ago', 91, 66], ['Sep', 80, 59], ['Oct', 85, 62], ['Nov', 74, 54], ['Dic', 96, 70]];
    return base.map(([etiqueta, ventas, ingresos]) => ({ etiqueta: String(etiqueta), ventas: Number(ventas), ingresos: Number(ingresos) }));
  }

  chartPath(serie: 'ventas' | 'ingresos'): string {
    const puntos = this.puntosGrafico;
    return puntos.map((punto, index) => {
      const x = 38 + index * (594 / (puntos.length - 1));
      const y = 225 - punto[serie] * 2;
      if (index === 0) return `M ${x} ${y}`;
      const previous = puntos[index - 1];
      const previousX = 38 + (index - 1) * (594 / (puntos.length - 1));
      const previousY = 225 - previous[serie] * 2;
      const mid = (previousX + x) / 2;
      return `C ${mid} ${previousY}, ${mid} ${y}, ${x} ${y}`;
    }).join(' ');
  }

  chartArea(serie: 'ventas' | 'ingresos'): string {
    return `${this.chartPath(serie)} L 632 225 L 38 225 Z`;
  }

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
    if (this.planAccion[index].tipo === 'completed') return;
    this.planAccion[index] = {
      ...this.planAccion[index],
      tipo: 'completed'
    };
  }

  descartarAlerta(index: number): void { this.alertasVisibles.splice(index, 1); }

  async enviarConsulta(): Promise<void> {
    const pregunta = this.consulta.trim();
    if (!pregunta || this.consultando) return;

    this.mensajes.push({ autor: 'usuario', texto: pregunta });
    this.consulta = '';
    this.consultando = true;
    try {
      const respuesta = await this.chatbot.consultar(pregunta, {
        ventasMes: 'S/ 248,600',
        ingresosNetos: 'S/ 87,340',
        productosEnStock: 3842,
        pedidosPendientes: 46,
        alertas: this.alertasVisibles,
      });
      this.mensajes.push({ autor: 'asistente', texto: respuesta });
    } finally {
      this.consultando = false;
    }
  }
}
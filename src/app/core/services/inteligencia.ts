import { Service, inject } from '@angular/core';
import { OnboardingService } from './onboarding-state';

export type Periodo = 7 | 30 | 90;

export interface Indicador {
  id: string;
  titulo: string;
  valor: string;
  /** Variación respecto al período anterior equivalente. */
  variacion: number;
  unidad: '%' | 'pts';
  /** Si es true, que el número suba es una buena noticia (ventas); si no, es mala (stock bajo). */
  altoEsBueno: boolean;
  detalle: string;
  icono: string;
}

export interface PuntoTendencia {
  etiqueta: string;
  actual: number;
  anterior: number;
}

export interface BarraCategoria {
  categoria: string;
  valor: number;
}

export interface Recomendacion {
  id: string;
  titulo: string;
  explicacion: string;
  impacto: string;
  ruta: string;
  accion: string;
  prioridad: 'Alta' | 'Media' | 'Oportunidad';
  /** Por qué se prioriza para este usuario (según su onboarding). Vacío si no aplica. */
  motivo: string;
}

export interface ResumenInteligencia {
  periodo: Periodo;
  indicadores: Indicador[];
  tendencia: PuntoTendencia[];
  categorias: BarraCategoria[];
  recomendaciones: Recomendacion[];
}

interface RecomendacionBase extends Omit<Recomendacion, 'motivo'> {
  /** Módulos del onboarding relacionados. */
  modulos: string[];
  /** Metas del onboarding relacionadas. */
  metas: string[];
}

const CATALOGO: RecomendacionBase[] = [
  {
    id: 'stock', titulo: 'Reponer productos con stock bajo', prioridad: 'Alta',
    explicacion: 'Hay productos por debajo del mínimo. Repón primero los de mayor rotación para no perder ventas.',
    impacto: 'Evita ≈ S/ 1,200 en ventas perdidas', ruta: '/inventario', accion: 'Ir a Inventario',
    modulos: ['Inventario'], metas: ['Organizar mi negocio', 'Aumentar mis ventas'],
  },
  {
    id: 'gastos', titulo: 'Revisar los gastos de publicidad', prioridad: 'Alta',
    explicacion: 'La publicidad creció más rápido que las ventas. Ajusta o pausa las campañas que no convierten.',
    impacto: 'Ahorro estimado de S/ 450 al mes', ruta: '/finanzas', accion: 'Ver gastos',
    modulos: ['Finanzas', 'Reportes'], metas: ['Controlar mis gastos'],
  },
  {
    id: 'margen', titulo: 'Promociona tus productos de mayor margen', prioridad: 'Oportunidad',
    explicacion: 'Los clientes que compran tus productos estrella gastan más por visita. Aún no tienen promoción activa.',
    impacto: 'Hasta +8% de margen', ruta: '/ventas', accion: 'Ir a Ventas',
    modulos: ['Ventas', 'Reportes'], metas: ['Aumentar mis ventas'],
  },
  {
    id: 'inactivos', titulo: 'Reactiva a tus clientes frecuentes inactivos', prioridad: 'Media',
    explicacion: 'Varios clientes frecuentes no compran hace más de 3 semanas. Una oferta con fecha límite suele funcionar.',
    impacto: '≈ S/ 900 en ventas recuperables', ruta: '/clientes', accion: 'Ver clientes',
    modulos: ['Clientes', 'Ventas'], metas: ['Aumentar mis ventas'],
  },
  {
    id: 'proveedores', titulo: 'Compara precios con tus proveedores', prioridad: 'Media',
    explicacion: 'Pedir cotización a otro proveedor para tus 3 compras más grandes puede bajar tu costo de mercadería.',
    impacto: 'Ahorro estimado del 5% en compras', ruta: '/proveedores', accion: 'Ir a Proveedores',
    modulos: ['Compras', 'Finanzas'], metas: ['Controlar mis gastos'],
  },
  {
    id: 'tareas', titulo: 'Crea un módulo para tus tareas repetitivas', prioridad: 'Oportunidad',
    explicacion: 'Si anotas lo mismo una y otra vez (pedidos, entregas, reservas), un módulo propio te ahorra tiempo.',
    impacto: 'Hasta 3 horas menos por semana', ruta: '/custom-modules', accion: 'Crear módulo',
    modulos: [], metas: ['Ahorrar tiempo', 'Organizar mi negocio'],
  },
];

const ORDEN_PRIORIDAD = { Alta: 0, Media: 1, Oportunidad: 2 } as const;

/**
 * Datos simulados del Centro de Inteligencia.
 * `obtener()` es asíncrono a propósito: para conectar una API basta con cambiar su cuerpo.
 */
@Service()
export class Inteligencia {
  private onboarding = inject(OnboardingService);

  obtener(periodo: Periodo): Promise<ResumenInteligencia> {
    return new Promise((resolve) => setTimeout(() => resolve(this.armar(periodo)), 350));
  }

  private armar(periodo: Periodo): ResumenInteligencia {
    const tendencia = this.tendencia(periodo);
    const ventas = tendencia.reduce((s, p) => s + p.actual, 0);
    const ventasPrevias = tendencia.reduce((s, p) => s + p.anterior, 0);
    const crudo = {
      7: { margen: [27.4, 28.0], stock: [5, 4], clientes: [9, 8], factor: 4320 / 18420 },
      30: { margen: [28.1, 26.9], stock: [5, 6], clientes: [34, 28], factor: 1 },
      90: { margen: [26.9, 26.5], stock: [8, 9], clientes: [97, 86], factor: 52960 / 18420 },
    }[periodo];

    const indicadores: Indicador[] = [
      {
        id: 'ventas', titulo: 'Ventas', valor: this.soles(ventas), variacion: this.porcentaje(ventas, ventasPrevias), unidad: '%',
        altoEsBueno: true, detalle: `Ventas de los últimos ${periodo} días`, icono: 'bi-cart3',
      },
      {
        id: 'margen', titulo: 'Margen', valor: `${crudo.margen[0].toLocaleString('es-PE', { minimumFractionDigits: 1 })}%`,
        variacion: Math.round((crudo.margen[0] - crudo.margen[1]) * 10) / 10, unidad: 'pts', altoEsBueno: true,
        detalle: 'Ganancia sobre ventas', icono: 'bi-graph-up-arrow',
      },
      {
        id: 'stock', titulo: 'Productos con poco stock', valor: String(crudo.stock[0]), variacion: this.porcentaje(crudo.stock[0], crudo.stock[1]),
        unidad: '%', altoEsBueno: false, detalle: 'Por debajo del mínimo definido', icono: 'bi-box-seam',
      },
      {
        id: 'clientes', titulo: 'Clientes nuevos', valor: String(crudo.clientes[0]), variacion: this.porcentaje(crudo.clientes[0], crudo.clientes[1]),
        unidad: '%', altoEsBueno: true, detalle: 'Primera compra en el período', icono: 'bi-person-plus',
      },
    ];

    const base = [
      ['Bebidas', 7200], ['Snacks', 4100], ['Accesorios', 3300], ['Servicios', 2400], ['Otros', 1420],
    ] as const;
    const categorias = base.map(([categoria, valor]) => ({ categoria, valor: Math.round(valor * crudo.factor) }));

    return { periodo, indicadores, tendencia, categorias, recomendaciones: this.recomendaciones() };
  }

  /** Ordena las recomendaciones: primero las que coinciden con los módulos o metas del onboarding. */
  private recomendaciones(): Recomendacion[] {
    const modulos = this.onboarding.modules();
    const metas = this.onboarding.goals();
    return CATALOGO.map((item) => {
      const modulosEnComun = item.modulos.filter((m) => modulos.includes(m));
      const metasEnComun = item.metas.filter((m) => metas.includes(m));
      const puntos = modulosEnComun.length * 2 + metasEnComun.length * 2;
      const motivo = metasEnComun.length
        ? `Coincide con tu meta: ${metasEnComun[0].toLowerCase()}`
        : modulosEnComun.length
          ? `Usas el módulo ${modulosEnComun[0]}`
          : '';
      const { modulos: _m, metas: _g, ...visible } = item;
      return { puntos, tarjeta: { ...visible, motivo } };
    })
      .sort((a, b) => b.puntos - a.puntos || ORDEN_PRIORIDAD[a.tarjeta.prioridad] - ORDEN_PRIORIDAD[b.tarjeta.prioridad])
      .map((x) => x.tarjeta);
  }

  private tendencia(periodo: Periodo): PuntoTendencia[] {
    const hoy = new Date();
    const numeros = {
      7: { actual: [520, 610, 580, 700, 640, 810, 460], anterior: [480, 560, 590, 610, 600, 720, 490] },
      30: { actual: [3900, 4350, 4720, 5450], anterior: [3700, 4000, 4200, 4546] },
      90: { actual: [7800, 8200, 8650, 9100, 9300, 9910], anterior: [7200, 7500, 7900, 8100, 8300, 8400] },
    }[periodo];

    const etiquetas = numeros.actual.map((_, i, lista) => {
      if (periodo === 30) return `Sem ${i + 1}`;
      const dias = periodo === 7 ? lista.length - 1 - i : (lista.length - 1 - i) * 15;
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - dias);
      return periodo === 7
        ? fecha.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '')
        : fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }).replace('.', '');
    });

    return numeros.actual.map((actual, i) => ({ etiqueta: etiquetas[i], actual, anterior: numeros.anterior[i] }));
  }

  private porcentaje(actual: number, previo: number): number {
    return previo ? Math.round(((actual - previo) / previo) * 1000) / 10 : 0;
  }

  private soles(valor: number): string {
    return 'S/ ' + valor.toLocaleString('es-PE');
  }
}

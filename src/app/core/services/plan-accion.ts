import { Service, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OnboardingService } from './onboarding-state';

export type EstadoTarea = 'pendiente' | 'en curso' | 'hecha';
export type FaseId = 'ordenar' | 'medir' | 'crecer' | 'optimizar';

export interface Fase {
  id: FaseId;
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface Tarea {
  id: string;
  faseId: FaseId;
  titulo: string;
  descripcion: string;
  /** Ruta del módulo relacionado y su nombre para mostrarlo en el enlace. */
  ruta: string;
  modulo: string;
  duracion: string;
  estado: EstadoTarea;
  /** Fecha objetivo en formato AAAA-MM-DD. */
  fechaObjetivo: string;
  propia?: boolean;
}

interface PlanGuardado {
  origen: 'onboarding' | 'defecto';
  tareas: Tarea[];
}

interface Contexto {
  modulos: string[];
  metas: string[];
  categoria: string;
  equipo: boolean;
}

interface Plantilla extends Omit<Tarea, 'id' | 'estado' | 'fechaObjetivo'> {
  /** Solo se incluye si devuelve true (las tareas sin condición siempre entran). */
  si?: (c: Contexto) => boolean;
  /** Sube la tarea en la lista cuando devuelve true. */
  destaca?: (c: Contexto) => boolean;
}

const STORAGE_KEY = 'nexgest-plan-accion';
const MAX_POR_FASE = 5;
/** Días desde la creación del plan hasta la fecha objetivo de cada fase. */
const DIAS_FASE: Record<FaseId, number> = { ordenar: 7, medir: 21, crecer: 45, optimizar: 75 };

export const FASES: Fase[] = [
  { id: 'ordenar', nombre: 'Ordenar', descripcion: 'Deja tu información lista y en un solo lugar.', icono: 'bi-grid-1x2' },
  { id: 'medir', nombre: 'Medir', descripcion: 'Empieza a registrar para saber cómo vas.', icono: 'bi-bar-chart' },
  { id: 'crecer', nombre: 'Crecer', descripcion: 'Usa lo que mides para vender más.', icono: 'bi-graph-up-arrow' },
  { id: 'optimizar', nombre: 'Optimizar', descripcion: 'Afina costos, tiempos y procesos.', icono: 'bi-sliders' },
];

const PLANTILLAS: Plantilla[] = [
  // ----- Ordenar -----
  { faseId: 'ordenar', titulo: 'Registra tus productos', descripcion: 'Carga lo que vendes con su precio y stock actual.', ruta: '/inventario', modulo: 'Inventario', duracion: '30 min', destaca: (c) => c.modulos.includes('Inventario') },
  { faseId: 'ordenar', titulo: 'Carga tu lista de clientes', descripcion: 'Empieza por los 10 clientes que más te compran.', ruta: '/clientes', modulo: 'Clientes', duracion: '45 min', destaca: (c) => c.modulos.includes('Clientes') },
  { faseId: 'ordenar', titulo: 'Agrega a tus proveedores', descripcion: 'Anota con quién compras y cómo contactarlos.', ruta: '/proveedores', modulo: 'Proveedores', duracion: '30 min', si: (c) => c.modulos.includes('Compras') || c.metas.includes('Organizar mi negocio') },
  { faseId: 'ordenar', titulo: 'Invita a tu equipo', descripcion: 'Suma a quienes trabajan contigo y asígnales un rol.', ruta: '/equipo', modulo: 'Equipo', duracion: '15 min', si: (c) => c.equipo },
  { faseId: 'ordenar', titulo: 'Crea un módulo para lo que anotas a mano', descripcion: 'Pedidos, reservas, entregas: lo que hoy vive en un cuaderno.', ruta: '/custom-modules', modulo: 'Módulos', duracion: '20 min', si: (c) => c.metas.includes('Ahorrar tiempo') || !c.equipo },
  { faseId: 'ordenar', titulo: 'Completa los datos de tu negocio', descripcion: 'Revisa nombre, categoría y tamaño del equipo.', ruta: '/configuracion', modulo: 'Configuración', duracion: '10 min' },

  // ----- Medir -----
  { faseId: 'medir', titulo: 'Registra tus primeras ventas', descripcion: 'Anota cada venta del día para ver tu ritmo real.', ruta: '/ventas', modulo: 'Ventas', duracion: '20 min', destaca: (c) => c.modulos.includes('Ventas') || c.metas.includes('Aumentar mis ventas') },
  { faseId: 'medir', titulo: 'Anota tus ingresos y gastos de la semana', descripcion: 'Con esto sabrás cuánto te queda realmente.', ruta: '/finanzas', modulo: 'Finanzas', duracion: '30 min', destaca: (c) => c.modulos.includes('Finanzas') || c.metas.includes('Controlar mis gastos') },
  { faseId: 'medir', titulo: 'Define el stock mínimo de tus productos', descripcion: 'Así te avisamos antes de quedarte sin mercadería.', ruta: '/inventario', modulo: 'Inventario', duracion: '20 min', destaca: (c) => c.modulos.includes('Inventario') },
  { faseId: 'medir', titulo: 'Revisa tu Dashboard cada lunes', descripcion: 'Dedica 10 minutos a mirar tus números clave.', ruta: '/dashboard', modulo: 'Dashboard', duracion: '10 min' },
  { faseId: 'medir', titulo: 'Explora el Centro de Inteligencia', descripcion: 'Mira tendencias y recomendaciones de tu negocio.', ruta: '/centroInteligencia', modulo: 'Centro de Inteligencia', duracion: '15 min', destaca: (c) => c.modulos.includes('Reportes') },

  // ----- Crecer -----
  { faseId: 'crecer', titulo: 'Contacta a tus clientes inactivos', descripcion: 'Escríbeles con una oferta que venza pronto.', ruta: '/clientes', modulo: 'Clientes', duracion: '1 h', destaca: (c) => c.metas.includes('Aumentar mis ventas') },
  { faseId: 'crecer', titulo: 'Lanza una promoción de tu producto estrella', descripcion: 'Elige el de mejor margen y dale visibilidad.', ruta: '/ventas', modulo: 'Ventas', duracion: '1 h', destaca: (c) => c.metas.includes('Aumentar mis ventas') },
  { faseId: 'crecer', titulo: 'Aplica las recomendaciones de prioridad alta', descripcion: 'Empieza por las que más impacto estimado tienen.', ruta: '/centroInteligencia', modulo: 'Centro de Inteligencia', duracion: '30 min' },
  { faseId: 'crecer', titulo: 'Pide cotización a un segundo proveedor', descripcion: 'Compara precios en tus compras más grandes.', ruta: '/proveedores', modulo: 'Proveedores', duracion: '1 h', si: (c) => c.metas.includes('Controlar mis gastos') || c.modulos.includes('Compras') },

  // ----- Optimizar -----
  { faseId: 'optimizar', titulo: 'Revisa tus gastos por categoría', descripcion: 'Detecta cuál creció más y si valió la pena.', ruta: '/finanzas', modulo: 'Finanzas', duracion: '30 min', destaca: (c) => c.metas.includes('Controlar mis gastos') },
  { faseId: 'optimizar', titulo: 'Ajusta tu stock según lo que sí se vende', descripcion: 'Reduce lo que rota poco y repón lo que vuela.', ruta: '/inventario', modulo: 'Inventario', duracion: '30 min', destaca: (c) => c.modulos.includes('Inventario') },
  { faseId: 'optimizar', titulo: 'Automatiza una tarea repetitiva', descripcion: 'Conviértela en un módulo propio con sus campos.', ruta: '/custom-modules', modulo: 'Módulos', duracion: '45 min', si: (c) => c.metas.includes('Ahorrar tiempo') || c.metas.includes('Organizar mi negocio'), destaca: (c) => c.metas.includes('Ahorrar tiempo') },
  { faseId: 'optimizar', titulo: 'Haz tu cierre del mes y compara', descripcion: 'Mira ventas, margen y gastos frente al mes anterior.', ruta: '/centroInteligencia', modulo: 'Centro de Inteligencia', duracion: '40 min' },
  { faseId: 'optimizar', titulo: 'Revisa los roles de tu equipo', descripcion: 'Asegúrate de que cada persona vea lo que necesita.', ruta: '/equipo', modulo: 'Equipo', duracion: '15 min', si: (c) => c.equipo },
];

/** Plan de acción: genera las tareas desde el onboarding y guarda el progreso en localStorage. */
@Service()
export class PlanAccion {
  private platformId = inject(PLATFORM_ID);
  private onboarding = inject(OnboardingService);

  readonly fases = FASES;
  readonly tareas = signal<Tarea[]>([]);
  readonly origen = signal<'onboarding' | 'defecto'>('defecto');

  readonly total = computed(() => this.tareas().length);
  readonly hechas = computed(() => this.tareas().filter((t) => t.estado === 'hecha').length);
  readonly progreso = computed(() => (this.total() ? Math.round((this.hechas() / this.total()) * 100) : 0));
  /** Primera fase con tareas pendientes; si todo está hecho, la última. */
  readonly faseActual = computed<FaseId>(() => {
    const tareas = this.tareas();
    const pendiente = this.fases.find((f) => tareas.some((t) => t.faseId === f.id && t.estado !== 'hecha'));
    return pendiente?.id ?? 'optimizar';
  });

  constructor() {
    const guardado = this.leer();
    if (guardado) {
      this.tareas.set(guardado.tareas);
      this.origen.set(guardado.origen);
    } else {
      this.generar([]);
    }
    this.sincronizar();
  }

  /**
   * Si el plan guardado era genérico y ya existen respuestas del onboarding, lo personaliza
   * conservando el progreso. Las pantallas que muestran el plan lo llaman al abrirse.
   */
  sincronizar(): void {
    if (this.origen() === 'defecto' && this.onboarding.hasAnswers()) this.generar(this.tareas());
  }

  tareasDe(faseId: FaseId): Tarea[] {
    return this.tareas().filter((t) => t.faseId === faseId);
  }

  cambiarEstado(id: string, estado: EstadoTarea): void {
    this.actualizar((t) => (t.id === id ? { ...t, estado } : t));
  }

  alternarHecha(id: string): void {
    this.actualizar((t) => (t.id === id ? { ...t, estado: t.estado === 'hecha' ? 'pendiente' : 'hecha' } : t));
  }

  agregar(datos: { titulo: string; descripcion: string; faseId: FaseId; fechaObjetivo: string }): void {
    const tarea: Tarea = {
      id: `propia-${Date.now()}`,
      faseId: datos.faseId,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      ruta: '',
      modulo: '',
      duracion: '',
      estado: 'pendiente',
      fechaObjetivo: datos.fechaObjetivo,
      propia: true,
    };
    this.tareas.update((lista) => [...lista, tarea]);
    this.guardar();
  }

  eliminar(id: string): void {
    this.tareas.update((lista) => lista.filter((t) => t.id !== id));
    this.guardar();
  }

  /** Una tarea está atrasada si su fecha objetivo ya pasó y no está hecha. */
  estaAtrasada(tarea: Tarea): boolean {
    return tarea.estado !== 'hecha' && !!tarea.fechaObjetivo && tarea.fechaObjetivo < this.hoy();
  }

  /** Borra el progreso y vuelve a generar el plan desde cero. */
  reiniciar(): void {
    this.generar([]);
  }

  hoy(): string {
    return this.fechaIso(new Date());
  }

  // ----- Generación -----

  private generar(previas: Tarea[]): void {
    const contexto: Contexto = {
      modulos: this.onboarding.modules(),
      metas: this.onboarding.goals(),
      categoria: this.onboarding.category(),
      equipo: !!this.onboarding.teamSize() && this.onboarding.teamSize() !== 'Solo yo',
    };
    const conRespuestas = this.onboarding.hasAnswers();
    const creado = new Date();
    const generadas: Tarea[] = [];

    for (const fase of this.fases) {
      const fecha = new Date(creado.getFullYear(), creado.getMonth(), creado.getDate() + DIAS_FASE[fase.id]);
      const elegidas = PLANTILLAS.filter((p) => p.faseId === fase.id && (!p.si || (conRespuestas && p.si(contexto))))
        .map((p, indice) => ({ p, puntos: conRespuestas && p.destaca?.(contexto) ? 1 : 0, indice }))
        .sort((a, b) => b.puntos - a.puntos || a.indice - b.indice)
        .slice(0, MAX_POR_FASE);

      for (const { p } of elegidas) {
        const { si: _si, destaca: _destaca, ...base } = p;
        const anterior = previas.find((t) => !t.propia && t.titulo === p.titulo);
        generadas.push({
          ...base,
          id: `${fase.id}-${generadas.length + 1}`,
          estado: anterior?.estado ?? 'pendiente',
          fechaObjetivo: this.fechaIso(fecha),
        });
      }
    }

    this.tareas.set([...generadas, ...previas.filter((t) => t.propia)]);
    this.origen.set(conRespuestas ? 'onboarding' : 'defecto');
    this.guardar();
  }

  private actualizar(cambio: (t: Tarea) => Tarea): void {
    this.tareas.update((lista) => lista.map(cambio));
    this.guardar();
  }

  private fechaIso(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  // ----- Persistencia (solo en el navegador) -----

  private leer(): PlanGuardado | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw) as PlanGuardado;
      return Array.isArray(data?.tareas) ? data : null;
    } catch {
      return null;
    }
  }

  private guardar(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const plan: PlanGuardado = { origen: this.origen(), tareas: this.tareas() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // Si no se puede guardar, el plan sigue funcionando en memoria.
    }
  }
}

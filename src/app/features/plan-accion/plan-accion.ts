import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoTarea, FaseId, PlanAccion as PlanService, Tarea } from '../../core/services/plan-accion';
import { Dialog } from '../../shared/components/dialog/dialog';
import { DynamicForm, FormFieldDef } from '../../shared/components/dynamic-form/dynamic-form';

@Component({
  imports: [RouterLink, Dialog, DynamicForm],
  selector: 'app-plan-accion',
  styleUrl: './plan-accion.css',
  templateUrl: './plan-accion.html',
})
export class PlanAccion {
  readonly plan = inject(PlanService);

  constructor() {
    this.plan.sincronizar();
  }

  readonly estados: { valor: EstadoTarea; etiqueta: string }[] = [
    { valor: 'pendiente', etiqueta: 'Pendiente' },
    { valor: 'en curso', etiqueta: 'En curso' },
    { valor: 'hecha', etiqueta: 'Hecha' },
  ];

  formularioAbierto = signal(false);
  reinicioAbierto = signal(false);

  readonly camposTarea: FormFieldDef[] = [
    { key: 'titulo', label: 'Tarea', tipo: 'Texto', requerido: true },
    { key: 'descripcion', label: 'Descripción (opcional)', tipo: 'Texto' },
    { key: 'fase', label: 'Fase', tipo: 'Selección', opciones: this.plan.fases.map((f) => f.nombre), requerido: true },
    { key: 'fecha', label: 'Fecha objetivo', tipo: 'Fecha', requerido: true },
  ];

  /** Valores iniciales del formulario: la fase actual y una fecha a una semana. */
  valoresIniciales = computed(() => {
    const fase = this.plan.fases.find((f) => f.id === this.plan.faseActual());
    const en7 = new Date();
    en7.setDate(en7.getDate() + 7);
    const mes = String(en7.getMonth() + 1).padStart(2, '0');
    const dia = String(en7.getDate()).padStart(2, '0');
    return { fase: fase?.nombre ?? '', fecha: `${en7.getFullYear()}-${mes}-${dia}` };
  });

  readonly atrasadas = computed(() => this.plan.tareas().filter((t) => this.plan.estaAtrasada(t)).length);

  /** Estado visual de cada fase en la línea de tiempo. */
  estadoFase(faseId: FaseId): 'completa' | 'actual' | 'siguiente' {
    const tareas = this.plan.tareasDe(faseId);
    if (tareas.length && tareas.every((t) => t.estado === 'hecha')) return 'completa';
    return this.plan.faseActual() === faseId ? 'actual' : 'siguiente';
  }

  hechasDe(faseId: FaseId): number {
    return this.plan.tareasDe(faseId).filter((t) => t.estado === 'hecha').length;
  }

  cambiarEstado(tarea: Tarea, event: Event): void {
    this.plan.cambiarEstado(tarea.id, (event.target as HTMLSelectElement).value as EstadoTarea);
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-').map(Number);
    if (!anio || !mes || !dia) return iso;
    return new Date(anio, mes - 1, dia).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }).replace('.', '');
  }

  guardarTarea(datos: Record<string, unknown>): void {
    const fase = this.plan.fases.find((f) => f.nombre === datos['fase']);
    this.plan.agregar({
      titulo: String(datos['titulo']),
      descripcion: String(datos['descripcion'] ?? ''),
      faseId: fase?.id ?? this.plan.faseActual(),
      fechaObjetivo: String(datos['fecha']),
    });
    this.formularioAbierto.set(false);
  }

  confirmarReinicio(): void {
    this.plan.reiniciar();
    this.reinicioAbierto.set(false);
  }
}

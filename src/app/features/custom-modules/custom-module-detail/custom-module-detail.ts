import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';

import { ModuleFieldDef, ModuleRecord, Tenant, fieldKey } from '../../../core/services/tenant';
import { DataTable, TableColumn, TableRow, TableSort, formatearValor } from '../../../shared/components/data-table/data-table';
import { DynamicForm, FormFieldDef } from '../../../shared/components/dynamic-form/dynamic-form';
import { Dialog } from '../../../shared/components/dialog/dialog';

@Component({
  imports: [RouterLink, DataTable, DynamicForm, Dialog],
  selector: 'app-custom-module-detail',
  styleUrl: './custom-module-detail.css',
  templateUrl: './custom-module-detail.html',
})
export class CustomModuleDetail {
  private tenant = inject(Tenant);
  private route = inject(ActivatedRoute);
  private titulo = inject(Title);

  readonly id = toSignal(this.route.paramMap.pipe(map((p) => Number(p.get('id')))), { initialValue: NaN });
  readonly modulo = computed(() => this.tenant.customModules().find((m) => m.id === this.id()));

  /** Campos del módulo con su clave de almacenamiento. Si no hay ninguno, se usa "Nombre". */
  readonly campos = computed(() => {
    const definidos: ModuleFieldDef[] = this.modulo()?.campos?.length
      ? this.modulo()!.campos!
      : [{ nombre: 'Nombre', tipo: 'Texto' }];
    return definidos.map((c, i) => ({ ...c, key: fieldKey(c, i) }));
  });

  readonly columnas = computed<TableColumn[]>(() => this.campos().map((c) => ({ key: c.key, label: c.nombre, tipo: c.tipo })));
  readonly registros = computed<TableRow[]>(() => this.tenant.recordsByModule()[this.id()] ?? []);

  readonly busqueda = signal('');
  readonly orden = signal<TableSort | null>(null);
  readonly aviso = signal('');

  readonly formAbierto = signal(false);
  readonly editando = signal<ModuleRecord | null>(null);
  readonly eliminando = signal<TableRow | null>(null);

  /** Opciones del campo "Relación": registros del módulo relacionado, si es otro módulo propio. */
  private readonly opcionesRelacion = computed(() => {
    const nombre = this.modulo()?.relacion;
    const relacionado = nombre ? this.tenant.customModules().find((m) => m.nombre === nombre && m.id !== this.id()) : undefined;
    if (!relacionado) return [];
    const primero = relacionado.campos?.length ? fieldKey(relacionado.campos[0], 0) : null;
    if (!primero) return [];
    const valores = (this.tenant.recordsByModule()[relacionado.id] ?? []).map((r) => String(r[primero] ?? '')).filter(Boolean);
    return [...new Set(valores)];
  });

  readonly camposForm = computed<FormFieldDef[]>(() =>
    this.campos().map((c, i) => ({
      key: c.key,
      label: c.nombre,
      tipo: c.tipo,
      opciones: c.tipo === 'Relación' ? this.opcionesRelacion() : c.opciones,
      requerido: i === 0,
    })),
  );

  readonly filtrados = computed(() => {
    const consulta = this.busqueda().trim().toLowerCase();
    const columnas = this.columnas();
    let filas = this.registros();
    if (consulta) {
      filas = filas.filter((fila) =>
        columnas.some((c) => this.textoDe(fila[c.key], c.tipo).toLowerCase().includes(consulta)),
      );
    }
    const orden = this.orden();
    if (orden) {
      const tipo = columnas.find((c) => c.key === orden.key)?.tipo;
      const signo = orden.dir === 'asc' ? 1 : -1;
      filas = [...filas].sort((a, b) => this.comparar(a[orden.key], b[orden.key], tipo) * signo);
    }
    return filas;
  });

  constructor() {
    // Al pasar de un módulo a otro desde el sidebar el componente se reutiliza: limpiamos el estado de pantalla.
    effect(() => {
      this.id();
      untracked(() => {
        this.busqueda.set('');
        this.orden.set(null);
        this.formAbierto.set(false);
        this.eliminando.set(null);
        this.aviso.set('');
      });
    });
    effect(() => {
      const modulo = this.modulo();
      this.titulo.setTitle(modulo ? `NexGest · ${modulo.nombre}` : 'NexGest · Módulo no encontrado');
    });
  }

  alternar(): void {
    const modulo = this.modulo();
    if (modulo) this.tenant.toggleCustomModule(modulo);
  }

  buscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  /** Alterna el orden de una columna: ascendente, descendente y sin orden. */
  ordenar(key: string): void {
    const actual = this.orden();
    if (actual?.key !== key) this.orden.set({ key, dir: 'asc' });
    else this.orden.set(actual.dir === 'asc' ? { key, dir: 'desc' } : null);
  }

  nuevo(): void {
    this.editando.set(null);
    this.formAbierto.set(true);
  }

  editar(fila: TableRow): void {
    this.editando.set(fila as ModuleRecord);
    this.formAbierto.set(true);
  }

  cerrarFormulario(): void {
    this.formAbierto.set(false);
    this.editando.set(null);
  }

  guardar(datos: Record<string, unknown>): void {
    const actual = this.editando();
    if (actual) this.tenant.updateRecord(this.id(), actual.id, datos);
    else this.tenant.addRecord(this.id(), datos);
    this.cerrarFormulario();
    this.mostrarAviso(actual ? 'Registro actualizado.' : 'Registro creado.');
  }

  pedirEliminar(fila: TableRow): void {
    this.eliminando.set(fila);
  }

  confirmarEliminar(): void {
    const fila = this.eliminando();
    if (fila) {
      this.tenant.deleteRecord(this.id(), fila.id);
      this.mostrarAviso('Registro eliminado.');
    }
    this.eliminando.set(null);
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 3000);
  }

  private textoDe(valor: unknown, tipo?: string): string {
    if (tipo !== 'Booleano' && (valor === '' || valor === null || valor === undefined)) return '';
    return `${String(valor)} ${formatearValor(valor, tipo)}`;
  }

  private comparar(a: unknown, b: unknown, tipo?: string): number {
    const vacio = (v: unknown) => v === '' || v === null || v === undefined;
    if (tipo === 'Booleano') return Number(!!a) - Number(!!b);
    if (vacio(a) || vacio(b)) return Number(!vacio(a)) - Number(!vacio(b));
    if (tipo === 'Número' || tipo === 'Moneda') return Number(a) - Number(b);
    return String(a).localeCompare(String(b), 'es', { numeric: true });
  }
}

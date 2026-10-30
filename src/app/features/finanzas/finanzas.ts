import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../../shared/components/dialog/dialog';

interface Movimiento { fecha: string; tipo: 'Ingreso' | 'Gasto'; categoria: string; descripcion: string; monto: number; }

@Component({
  imports: [CommonModule, FormsModule, Dialog],
  selector: 'app-finanzas',
  styleUrl: './finanzas.css',
  templateUrl: './finanzas.html',
})
export class Finanzas {
  busqueda = '';
  tipoSeleccionado = 'Todos';
  categoriaSeleccionada = 'Todas';
  movimientos: Movimiento[] = [
    { fecha: '26 ago 2026', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Ventas semana 4', monto: 3950 },
    { fecha: '21 ago 2026', tipo: 'Gasto', categoria: 'Insumos', descripcion: 'Compra de insumos', monto: 1980 },
    { fecha: '18 ago 2026', tipo: 'Ingreso', categoria: 'Servicios', descripcion: 'Evento privado', monto: 900 },
    { fecha: '14 ago 2026', tipo: 'Ingreso', categoria: 'Ventas', descripcion: 'Ventas semana 2', monto: 4120 },
    { fecha: '12 ago 2026', tipo: 'Gasto', categoria: 'Publicidad', descripcion: 'Campaña en redes', monto: 1140 },
  ];

  /** Lectura directa de campos (los modales usan value/input en vez de ngModel). */
  texto(event: Event): string { return (event.target as HTMLInputElement).value; }
  numero(event: Event): number | null {
    const valor = (event.target as HTMLInputElement).valueAsNumber;
    return isNaN(valor) ? null : valor;
  }

  get ingresos(): number { return this.movimientos.filter(m => m.tipo === 'Ingreso').reduce((sum, m) => sum + m.monto, 0); }
  get gastos(): number { return this.movimientos.filter(m => m.tipo === 'Gasto').reduce((sum, m) => sum + m.monto, 0); }
  get balance(): number { return this.ingresos - this.gastos; }
  get cantidadIngresos(): number { return this.movimientos.filter(m => m.tipo === 'Ingreso').length; }
  get cantidadGastos(): number { return this.movimientos.filter(m => m.tipo === 'Gasto').length; }
  get gastosPorCategoria(): { nombre: string; monto: number; porcentaje: number }[] {
    const grupos = new Map<string, number>();
    for (const movimiento of this.movimientos.filter(m => m.tipo === 'Gasto')) {
      grupos.set(movimiento.categoria, (grupos.get(movimiento.categoria) ?? 0) + movimiento.monto);
    }
    return [...grupos].map(([nombre, monto]) => ({ nombre, monto, porcentaje: this.gastos ? monto / this.gastos * 100 : 0 }));
  }
  get movimientosFiltrados(): Movimiento[] {
    const query = this.busqueda.trim().toLocaleLowerCase();
    return this.movimientos.filter(m => (!query || `${m.descripcion} ${m.categoria} ${m.tipo}`.toLocaleLowerCase().includes(query)) &&
      (this.tipoSeleccionado === 'Todos' || m.tipo === this.tipoSeleccionado) &&
      (this.categoriaSeleccionada === 'Todas' || m.categoria === this.categoriaSeleccionada));
  }

  // ----- Modal: registrar movimiento -----
  formAbierto = false;
  readonly categoriasForm = ['Ventas', 'Servicios', 'Publicidad', 'Insumos', 'Otros'];
  formMov = this.movVacio();
  erroresMov: { descripcion?: string; monto?: string } = {};

  private movVacio() {
    return { tipo: 'Gasto' as Movimiento['tipo'], descripcion: '', categoria: 'Insumos', monto: null as number | null, fecha: this.hoyIso() };
  }

  registrarMovimiento(): void {
    this.formMov = this.movVacio();
    this.erroresMov = {};
    this.formAbierto = true;
  }

  cerrarFormulario(): void {
    this.formAbierto = false;
    this.erroresMov = {};
  }

  guardarMovimiento(): void {
    const descripcion = this.formMov.descripcion.trim();
    const monto = Number(this.formMov.monto);
    const errores: typeof this.erroresMov = {};
    if (!descripcion) errores.descripcion = 'Escribe una descripción.';
    if (!Number.isFinite(monto) || monto <= 0) errores.monto = 'Ingresa un monto mayor a cero.';
    this.erroresMov = errores;
    if (Object.keys(errores).length) return;

    this.movimientos = [{
      fecha: this.formatearFecha(this.formMov.fecha || this.hoyIso()),
      tipo: this.formMov.tipo,
      categoria: this.formMov.categoria,
      descripcion,
      monto,
    }, ...this.movimientos];
    this.cerrarFormulario();
  }

  private hoyIso(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  /** "2026-08-26" -> "26 ago 2026", igual que los movimientos existentes. */
  private formatearFecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-').map(Number);
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    if (!anio || !mes || !dia) return iso;
    return `${dia} ${meses[mes - 1]} ${anio}`;
  }
}

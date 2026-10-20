import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Movimiento { fecha: string; tipo: 'Ingreso' | 'Gasto'; categoria: string; descripcion: string; monto: number; }

@Component({
  imports: [CommonModule, FormsModule],
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

  registrarMovimiento(): void {
    const tipo = prompt('Tipo de movimiento: Ingreso o Gasto', 'Gasto');
    if (tipo !== 'Ingreso' && tipo !== 'Gasto') return;
    const descripcion = prompt('Descripción del movimiento:')?.trim();
    if (!descripcion) return;
    const monto = Number(prompt('Monto en soles:', '0'));
    if (!Number.isFinite(monto) || monto <= 0) { alert('Ingresa un monto mayor a cero.'); return; }
    const categoria = prompt('Categoría:', tipo === 'Ingreso' ? 'Ventas' : 'Insumos')?.trim() || 'Otros';
    this.movimientos = [{ fecha: new Date().toLocaleDateString('es-PE'), tipo, categoria, descripcion, monto }, ...this.movimientos];
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Venta {
  comprobante: string;
  cliente: string;
  fecha: string;
  diasAtras: number;
  estado: 'Completada' | 'Pendiente' | 'Anulada';
  total: number;
}

@Component({ imports: [CommonModule, FormsModule], selector: 'app-ventas', styleUrl: './ventas.css', templateUrl: './ventas.html' })
export class Ventas {
  busqueda = '';
  estadoSeleccionado = 'Todos';
  periodoSeleccionado = 'mes';
  ventas: Venta[] = [
    { comprobante: 'BV-001284', cliente: 'Juan Pérez', fecha: '26 ago 2026', diasAtras: 0, estado: 'Completada', total: 185 },
    { comprobante: 'BV-001283', cliente: 'María Torres', fecha: '26 ago 2026', diasAtras: 0, estado: 'Completada', total: 320 },
    { comprobante: 'BV-001282', cliente: 'Café Aurora', fecha: '25 ago 2026', diasAtras: 1, estado: 'Pendiente', total: 540 },
    { comprobante: 'BV-001281', cliente: 'Carlos Ramírez', fecha: '25 ago 2026', diasAtras: 1, estado: 'Completada', total: 95 },
    { comprobante: 'BV-001280', cliente: 'Ana Sánchez', fecha: '24 ago 2026', diasAtras: 2, estado: 'Anulada', total: 210 },
  ];

  get ventasFiltradas(): Venta[] {
    const q = this.busqueda.trim().toLocaleLowerCase();
    return this.ventas.filter((venta) => {
      const coincidePeriodo = this.periodoSeleccionado === 'mes' ||
        venta.diasAtras <= Number(this.periodoSeleccionado);
      return (!q || `${venta.comprobante} ${venta.cliente}`.toLocaleLowerCase().includes(q)) &&
        (this.estadoSeleccionado === 'Todos' || venta.estado === this.estadoSeleccionado) && coincidePeriodo;
    });
  }

  get totalVendido(): number { return this.ventas.filter((venta) => venta.estado === 'Completada').reduce((total, venta) => total + venta.total, 0); }
  get cantidadPendiente(): number { return this.ventas.filter((venta) => venta.estado === 'Pendiente').length; }
  get cantidadAnulada(): number { return this.ventas.filter((venta) => venta.estado === 'Anulada').length; }
  get cantidadCompletada(): number { return this.ventas.filter((venta) => venta.estado === 'Completada').length; }

  nuevaVenta(): void {
    const cliente = prompt('Nombre del cliente:')?.trim();
    if (!cliente) return;
    const total = Number(prompt('Total de la venta (S/):', '0'));
    if (!Number.isFinite(total) || total <= 0) { alert('Ingresa un monto válido mayor a cero.'); return; }
    const numero = Math.max(...this.ventas.map((venta) => Number(venta.comprobante.slice(-6))), 1284) + 1;
    this.ventas = [{ comprobante: `BV-${String(numero).padStart(6, '0')}`, cliente, fecha: new Date().toLocaleDateString('es-PE'), diasAtras: 0, estado: 'Pendiente', total }, ...this.ventas];
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../../shared/components/dialog/dialog';

interface ItemVenta { descripcion: string; cantidad: number | null; precio: number | null; }

interface Venta {
  comprobante: string;
  cliente: string;
  fecha: string;
  diasAtras: number;
  estado: 'Completada' | 'Pendiente' | 'Anulada';
  total: number;
  metodoPago?: string;
  items?: { descripcion: string; cantidad: number; precio: number }[];
}

@Component({ imports: [CommonModule, FormsModule, Dialog], selector: 'app-ventas', styleUrl: './ventas.css', templateUrl: './ventas.html' })
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

  /** Lectura directa de campos (los modales usan value/input en vez de ngModel). */
  texto(event: Event): string { return (event.target as HTMLInputElement).value; }
  numero(event: Event): number | null {
    const valor = (event.target as HTMLInputElement).valueAsNumber;
    return isNaN(valor) ? null : valor;
  }

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

  // ----- Modal: nueva venta (rápida o detallada) -----
  ventaAbierta = false;
  modo: 'rapida' | 'detallada' = 'rapida';
  errorVenta = '';
  readonly metodosPago = ['Efectivo', 'Yape / Plin', 'Tarjeta', 'Transferencia'];
  readonly estadosNuevos: Venta['estado'][] = ['Completada', 'Pendiente'];

  formVenta = this.ventaVacia();
  items: ItemVenta[] = [this.itemVacio()];

  private ventaVacia() {
    return {
      cliente: '',
      producto: '',
      total: null as number | null,
      estado: 'Completada' as Venta['estado'],
      metodoPago: 'Efectivo',
      fecha: this.hoyIso(),
    };
  }

  private itemVacio(): ItemVenta {
    return { descripcion: '', cantidad: 1, precio: null };
  }

  nuevaVenta(): void {
    this.modo = 'rapida';
    this.errorVenta = '';
    this.formVenta = this.ventaVacia();
    this.items = [this.itemVacio()];
    this.ventaAbierta = true;
  }

  cerrarVenta(): void {
    this.ventaAbierta = false;
  }

  cambiarModo(modo: 'rapida' | 'detallada'): void {
    this.modo = modo;
    this.errorVenta = '';
  }

  agregarItem(): void {
    this.items = [...this.items, this.itemVacio()];
  }

  quitarItem(indice: number): void {
    this.items = this.items.length > 1 ? this.items.filter((_, i) => i !== indice) : [this.itemVacio()];
  }

  subtotalItem(item: ItemVenta): number {
    return (Number(item.cantidad) || 0) * (Number(item.precio) || 0);
  }

  get totalDetallada(): number {
    return this.items.reduce((suma, item) => suma + this.subtotalItem(item), 0);
  }

  guardarVenta(): void {
    let cliente: string;
    let total: number;
    let detalle: NonNullable<Venta['items']>;
    let estado: Venta['estado'];
    let metodoPago: string | undefined;

    if (this.modo === 'rapida') {
      // Venta rápida: solo producto, fecha y monto.
      const producto = this.formVenta.producto.trim();
      total = Number(this.formVenta.total);
      if (!producto) { this.errorVenta = 'Escribe el producto vendido.'; return; }
      if (!Number.isFinite(total) || total <= 0) { this.errorVenta = 'Ingresa un monto mayor a cero.'; return; }
      cliente = 'Cliente general';
      estado = 'Completada';
      metodoPago = undefined;
      detalle = [{ descripcion: producto, cantidad: 1, precio: total }];
    } else {
      cliente = this.formVenta.cliente.trim();
      if (!cliente) { this.errorVenta = 'Escribe el nombre del cliente.'; return; }
      const validos = this.items.filter(item => item.descripcion.trim() || item.precio);
      const incompletos = validos.some(item => !item.descripcion.trim() || !(Number(item.cantidad) > 0) || !(Number(item.precio) > 0));
      if (!validos.length || incompletos) { this.errorVenta = 'Completa descripción, cantidad y precio de cada producto.'; return; }
      detalle = validos.map(item => ({ descripcion: item.descripcion.trim(), cantidad: Number(item.cantidad), precio: Number(item.precio) }));
      total = detalle.reduce((suma, item) => suma + item.cantidad * item.precio, 0);
      estado = this.formVenta.estado;
      metodoPago = this.formVenta.metodoPago;
    }

    const [anio, mes, dia] = (this.formVenta.fecha || this.hoyIso()).split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    const dias = Math.max(0, Math.round((new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime() - fecha.getTime()) / 86400000));
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const numero = Math.max(...this.ventas.map((venta) => Number(venta.comprobante.slice(-6))), 1284) + 1;

    this.ventas = [{
      comprobante: `BV-${String(numero).padStart(6, '0')}`,
      cliente,
      fecha: `${dia} ${meses[mes - 1]} ${anio}`,
      diasAtras: dias,
      estado,
      total: Math.round(total * 100) / 100,
      metodoPago,
      items: detalle,
    }, ...this.ventas];
    this.ventaAbierta = false;
  }

  private hoyIso(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }
}

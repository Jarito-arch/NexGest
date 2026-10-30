import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Permisos } from '../../core/services/permisos';
import { FormsModule } from '@angular/forms';

interface Producto {
  nombre: string;
  sku: string;
  categoria: string;
  stock: number;
  precio: number;
}

@Component({
  imports: [CommonModule, FormsModule, Dialog],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario {
  busqueda = '';
  categoriaSeleccionada = 'Todas';
  estadoSeleccionado = 'Todos';
  productos: Producto[] = [
    { nombre: 'Café americano', sku: 'CAF-001', categoria: 'Café', stock: 85, precio: 8.5 },
    { nombre: 'Leche entera', sku: 'LEC-004', categoria: 'Lácteos', stock: 18, precio: 5.8 },
    { nombre: 'Vasos descartables', sku: 'VAS-010', categoria: 'Insumos', stock: 320, precio: 0.35 },
    { nombre: 'Brownie', sku: 'BRO-021', categoria: 'Postres', stock: 4, precio: 9 },
  ];
  movimientos: { producto: string; cantidad: number; fecha: string }[] = [];

  get productosFiltrados(): Producto[] {
    const query = this.busqueda.trim().toLocaleLowerCase();
    return this.productos.filter((producto) => {
      const texto = `${producto.nombre} ${producto.sku} ${producto.categoria}`.toLocaleLowerCase();
      const estado = this.estadoDe(producto);
      return (!query || texto.includes(query)) &&
        (this.categoriaSeleccionada === 'Todas' || producto.categoria === this.categoriaSeleccionada) &&
        (this.estadoSeleccionado === 'Todos' || estado === this.estadoSeleccionado);
    });
  }

  get unidadesDisponibles(): number { return this.productos.reduce((total, producto) => total + producto.stock, 0); }
  get productosBajos(): number { return this.productos.filter((producto) => producto.stock > 0 && producto.stock <= 20).length; }
  get valorInventario(): number { return this.productos.reduce((total, producto) => total + producto.stock * producto.precio, 0); }

  estadoDe(producto: Producto): string {
    if (producto.stock === 0) return 'Agotado';
    if (producto.stock <= 5) return 'Agotándose';
    if (producto.stock <= 20) return 'Stock bajo';
    return 'Disponible';
  }

  // ----- Modales: nuevo producto, registrar entrada, editar y movimientos -----
  readonly permisos = inject(Permisos);
  readonly categorias = ['Café', 'Lácteos', 'Insumos', 'Postres', 'Otros'];

  dialogo: 'producto' | 'entrada' | 'editar' | 'movimientos' | null = null;
  productoEditando: Producto | null = null;
  formProducto = this.productoVacio();
  formEntrada: { sku: string; cantidad: number | null } = { sku: '', cantidad: null };
  errores: { nombre?: string; stock?: string; precio?: string; cantidad?: string } = {};

  private productoVacio() {
    return { nombre: '', categoria: 'Insumos', stock: 0 as number | null, precio: null as number | null };
  }

  texto(event: Event): string { return (event.target as HTMLInputElement).value; }
  numero(event: Event): number | null {
    const valor = (event.target as HTMLInputElement).valueAsNumber;
    return isNaN(valor) ? null : valor;
  }

  cerrarDialogo(): void {
    this.dialogo = null;
    this.productoEditando = null;
    this.errores = {};
  }

  nuevoProducto(): void {
    this.formProducto = this.productoVacio();
    this.errores = {};
    this.dialogo = 'producto';
  }

  guardarProducto(): void {
    const nombre = this.formProducto.nombre.trim();
    const stock = Number(this.formProducto.stock ?? 0);
    const precio = Number(this.formProducto.precio);
    const errores: typeof this.errores = {};
    if (!nombre) errores.nombre = 'Escribe el nombre del producto.';
    if (!Number.isInteger(stock) || stock < 0) errores.stock = 'Ingresa un número entero de unidades (0 o más).';
    if (this.formProducto.precio === null || !Number.isFinite(precio) || precio < 0) errores.precio = 'Ingresa un precio válido.';
    this.errores = errores;
    if (Object.keys(errores).length) return;

    const categoria = this.formProducto.categoria;
    const sku = `${categoria.slice(0, 3).toLocaleUpperCase()}-${String(Date.now()).slice(-4)}`;
    this.productos = [...this.productos, { nombre, sku, categoria, stock, precio }];
    this.cerrarDialogo();
  }

  registrarEntrada(producto?: Producto): void {
    if (!this.productos.length) { this.nuevoProducto(); return; }
    const seleccionado = producto ?? this.productos.find((item) => item.stock <= 20) ?? this.productos[0];
    this.formEntrada = { sku: seleccionado.sku, cantidad: null };
    this.errores = {};
    this.dialogo = 'entrada';
  }

  guardarEntrada(): void {
    const producto = this.productos.find((item) => item.sku === this.formEntrada.sku);
    const cantidad = Number(this.formEntrada.cantidad);
    if (!producto) return;
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      this.errores = { cantidad: 'Ingresa un número entero mayor a cero.' };
      return;
    }
    producto.stock += cantidad;
    this.movimientos = [{ producto: producto.nombre, cantidad, fecha: new Date().toLocaleString('es-PE') }, ...this.movimientos];
    this.cerrarDialogo();
  }

  editarProducto(producto: Producto): void {
    this.productoEditando = producto;
    this.formProducto = { nombre: producto.nombre, categoria: producto.categoria, stock: producto.stock, precio: producto.precio };
    this.errores = {};
    this.dialogo = 'editar';
  }

  guardarEdicion(): void {
    const producto = this.productoEditando;
    if (!producto) return;
    const nombre = this.formProducto.nombre.trim();
    const precio = Number(this.formProducto.precio);
    const errores: typeof this.errores = {};
    if (!nombre) errores.nombre = 'Escribe el nombre del producto.';
    if (this.formProducto.precio === null || !Number.isFinite(precio) || precio < 0) errores.precio = 'Ingresa un precio válido.';
    this.errores = errores;
    if (Object.keys(errores).length) return;
    producto.nombre = nombre;
    producto.categoria = this.formProducto.categoria;
    producto.precio = precio;
    this.cerrarDialogo();
  }

  verMovimientos(): void {
    this.dialogo = 'movimientos';
  }
}

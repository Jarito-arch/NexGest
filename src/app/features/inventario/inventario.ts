import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Producto {
  nombre: string;
  sku: string;
  categoria: string;
  stock: number;
  precio: number;
}

@Component({
  imports: [CommonModule, FormsModule],
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

  nuevoProducto(): void {
    const nombre = prompt('Nombre del producto:')?.trim();
    if (!nombre) return;
    const categoria = prompt('Categoría (Café, Lácteos, Insumos o Postres):', 'Insumos')?.trim() || 'Insumos';
    const stock = Number(prompt('Unidades iniciales:', '0'));
    const precio = Number(prompt('Precio unitario (S/):', '0'));
    if (!Number.isFinite(stock) || stock < 0 || !Number.isFinite(precio) || precio < 0) {
      alert('Ingresa un stock y precio válidos.');
      return;
    }
    const sku = `${categoria.slice(0, 3).toLocaleUpperCase()}-${String(Date.now()).slice(-4)}`;
    this.productos = [...this.productos, { nombre, sku, categoria, stock, precio }];
  }

  registrarEntrada(producto?: Producto): void {
    const seleccionado = producto ?? this.productos.find((item) => item.stock <= 20) ?? this.productos[0];
    if (!seleccionado) { this.nuevoProducto(); return; }
    const cantidad = Number(prompt(`Unidades que ingresan para ${seleccionado.nombre}:`, '1'));
    if (!Number.isInteger(cantidad) || cantidad <= 0) return;
    seleccionado.stock += cantidad;
    this.movimientos = [{ producto: seleccionado.nombre, cantidad, fecha: new Date().toLocaleString('es-PE') }, ...this.movimientos];
  }

  editarProducto(producto: Producto): void {
    const precio = Number(prompt(`Nuevo precio para ${producto.nombre} (S/):`, String(producto.precio)));
    if (Number.isFinite(precio) && precio >= 0) producto.precio = precio;
  }

  verMovimientos(): void {
    const detalle = this.movimientos.length
      ? this.movimientos.slice(0, 8).map((movimiento) => `${movimiento.fecha}: +${movimiento.cantidad} · ${movimiento.producto}`).join('\n')
      : 'Aún no hay movimientos registrados.';
    alert(detalle);
  }
}

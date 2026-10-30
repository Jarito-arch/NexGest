import { Component, inject } from '@angular/core';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Permisos } from '../../core/services/permisos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Proveedor { nombre: string; telefono: string; correo: string; direccion: string; }

@Component({
  imports: [CommonModule, FormsModule, Dialog],
  selector: 'app-proveedores',
  styleUrl: './proveedores.css',
  templateUrl: './proveedores.html',
})
export class Proveedores {
  busqueda = '';
  filtro = 'Todos';
  proveedores: Proveedor[] = [
    { nombre: 'Tostaduría Central', telefono: '987 654 321', correo: 'ventas@tostaduriacentral.pe', direccion: 'Av. Balta 450, Chiclayo' },
    { nombre: 'Lácteos Fresh', telefono: '965 432 109', correo: 'pedidos@lacteosfresh.pe', direccion: 'Calle San José 128, Chiclayo' },
    { nombre: 'EmpaquePro', telefono: '954 321 876', correo: 'contacto@empaquepro.pe', direccion: 'Av. Luis Gonzales 1020' },
    { nombre: 'Repostería San José', telefono: '976 210 543', correo: '', direccion: 'Calle Elías Aguirre 345' },
    { nombre: 'Café del Valle', telefono: '943 876 210', correo: 'ventas@cafedelvalle.pe', direccion: '' },
  ];

  get proveedoresFiltrados(): Proveedor[] {
    const q = this.busqueda.trim().toLocaleLowerCase();
    return this.proveedores.filter(p => {
      const texto = `${p.nombre} ${p.telefono} ${p.correo} ${p.direccion}`.toLocaleLowerCase();
      const tiene = this.filtro === 'Todos' || (this.filtro === 'Con teléfono' ? !!p.telefono : this.filtro === 'Con correo' ? !!p.correo : !!p.direccion);
      return (!q || texto.includes(q)) && tiene;
    });
  }
  get conTelefono(): number { return this.proveedores.filter(p => !!p.telefono).length; }
  get conCorreo(): number { return this.proveedores.filter(p => !!p.correo).length; }
  get conDireccion(): number { return this.proveedores.filter(p => !!p.direccion).length; }

  // ----- Modales: nuevo proveedor y eliminar -----
  readonly permisos = inject(Permisos);
  formAbierto = false;
  proveedorAEliminar: Proveedor | null = null;
  formProveedor = { nombre: '', telefono: '', correo: '', direccion: '' };
  errores: { nombre?: string; telefono?: string; correo?: string } = {};

  texto(event: Event): string { return (event.target as HTMLInputElement).value; }

  nuevoProveedor(): void {
    this.formProveedor = { nombre: '', telefono: '', correo: '', direccion: '' };
    this.errores = {};
    this.formAbierto = true;
  }

  cerrarFormulario(): void {
    this.formAbierto = false;
    this.errores = {};
  }

  guardarProveedor(): void {
    const nombre = this.formProveedor.nombre.trim();
    const telefono = this.formProveedor.telefono.trim();
    const correo = this.formProveedor.correo.trim();
    const errores: typeof this.errores = {};
    if (!nombre) errores.nombre = 'Escribe el nombre del proveedor.';
    else if (this.proveedores.some(p => p.nombre.toLocaleLowerCase() === nombre.toLocaleLowerCase())) errores.nombre = 'Ya tienes un proveedor con ese nombre.';
    if (telefono && !/^[\d\s+()-]{6,20}$/.test(telefono)) errores.telefono = 'Ingresa un teléfono válido.';
    if (correo && !/^\S+@\S+\.\S+$/.test(correo)) errores.correo = 'Ingresa un correo válido.';
    this.errores = errores;
    if (Object.keys(errores).length) return;
    this.proveedores = [...this.proveedores, { nombre, telefono, correo, direccion: this.formProveedor.direccion.trim() }];
    this.cerrarFormulario();
  }

  eliminar(proveedor: Proveedor): void {
    this.proveedorAEliminar = proveedor;
  }

  confirmarEliminar(): void {
    const proveedor = this.proveedorAEliminar;
    if (proveedor) this.proveedores = this.proveedores.filter(p => p !== proveedor);
    this.proveedorAEliminar = null;
  }

  iniciales(nombre: string): string { return nombre.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toLocaleUpperCase(); }
}

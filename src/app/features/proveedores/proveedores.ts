import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Proveedor { nombre: string; telefono: string; correo: string; direccion: string; }

@Component({
  imports: [CommonModule, FormsModule],
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

  nuevoProveedor(): void {
    const nombre = prompt('Nombre del proveedor:')?.trim();
    if (!nombre) return;
    const telefono = prompt('Teléfono (opcional):')?.trim() ?? '';
    const correo = prompt('Correo (opcional):')?.trim() ?? '';
    const direccion = prompt('Dirección (opcional):')?.trim() ?? '';
    this.proveedores = [...this.proveedores, { nombre, telefono, correo, direccion }];
  }
  eliminar(proveedor: Proveedor): void {
    if (confirm(`¿Eliminar a ${proveedor.nombre}?`)) this.proveedores = this.proveedores.filter(p => p !== proveedor);
  }
  iniciales(nombre: string): string { return nombre.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toLocaleUpperCase(); }
}

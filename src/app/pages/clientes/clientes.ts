import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Cliente {
  nombre: string;
  telefono: string;
  email: string;
  compras: number;
  ultimaCompra: string;
  estado: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})

export class Clientes {
  busqueda: string = '';
  estadoSeleccionado: string = 'Todos';
  periodoSeleccionado: string = '30';

  estadisticas = {
    total: 16,
    frecuentes: 5,
    inactivos: 4,
    ticket: 22.23
  };

  clientes: Cliente[] = [

    {
      nombre: 'María Alvarado',
      telefono: '987 654 321',
      email: 'maria.alvarado@correo.com',
      compras: 10,
      ultimaCompra: 'Hoy',
      estado: 'Frecuente'
    },

    {
      nombre: 'Jorge Ruiz',
      telefono: '986 210 455',
      email: 'jorge.ruiz@correo.com',
      compras: 3,
      ultimaCompra: 'Ayer',
      estado: 'Frecuente'
    },

    {
      nombre: 'Marta Gálvez',
      telefono: '985 331 907',
      email: 'marta.galvez@correo.com',
      compras: 1,
      ultimaCompra: 'hace 24 días',
      estado: 'Inactivo'
    },

    {
      nombre: 'Renzo Torres',
      telefono: '984 776 120',
      email: 'renzo.torres@correo.com',
      compras: 1,
      ultimaCompra: 'hace 29 días',
      estado: 'Inactivo'
    },

    {
      nombre: 'Lucía Chávez',
      telefono: '983 145 662',
      email: 'lucia.chavez@correo.com',
      compras: 0,
      ultimaCompra: 'hace 35 días',
      estado: 'Inactivo'
    },

    {
      nombre: 'Carlos Mendoza',
      telefono: '982 908 314',
      email: 'carlos.mendoza@correo.com',
      compras: 4,
      ultimaCompra: 'hace 2 días',
      estado: 'Frecuente'
    },

    {
      nombre: 'Ana Paredes',
      telefono: '981 447 208',
      email: 'ana.paredes@correo.com',
      compras: 2,
      ultimaCompra: 'hace 6 días',
      estado: 'Activo'
    },

    {
      nombre: 'Diego Salazar',
      telefono: '980 562 731',
      email: '',
      compras: 3,
      ultimaCompra: 'hace 4 días',
      estado: 'Frecuente'
    },

    {
      nombre: 'Valeria Cruz',
      telefono: '979 883 019',
      email: 'valeria.cruz@correo.com',
      compras: 1,
      ultimaCompra: 'hace 13 días',
      estado: 'Activo'
    },

    {
      nombre: 'Andrés Castillo',
      telefono: '978 452 611',
      email: 'andres.castillo@correo.com',
      compras: 0,
      ultimaCompra: 'Sin compras',
      estado: 'Activo'
    },

    {
      nombre: 'Paola Díaz',
      telefono: '977 321 445',
      email: 'paola.diaz@correo.com',
      compras: 0,
      ultimaCompra: 'Sin compras',
      estado: 'Activo'
    }

  ];

  clientesFiltrados: Cliente[] = [...this.clientes];


  actividades = [
    {
      nombre: 'María Alvarado',
      descripcion: 'Nueva compra',
      fecha: 'Hoy'
    },
    {
      nombre: 'Jorge Ruiz',
      descripcion: 'Nueva compra',
      fecha: 'Ayer'
    },
    {
      nombre: 'Camila Vargas',
      descripcion: 'Nueva compra',
      fecha: 'Ayer'
    },
    {
      nombre: 'Carlos Mendoza',
      descripcion: 'Nueva compra',
      fecha: '26/09'
    },
    {
      nombre: 'Diego Salazar',
      descripcion: 'Nueva compra',
      fecha: '24/09'
    },
    {
      nombre: 'Ana Paredes',
      descripcion: 'Nueva compra',
      fecha: '22/09'
    },
    {
      nombre: 'Sofía Rojas',
      descripcion: 'Nueva compra',
      fecha: '21/09'
    },
    {
      nombre: 'Valeria Cruz',
      descripcion: 'Nueva compra',
      fecha: '15/09'
    }
  ];


  clientesDestacados = [
    {
      nombre: 'María Alvarado',
      compras: 17
    },
    {
      nombre: 'Jorge Ruiz',
      compras: 9
    },
    {
      nombre: 'Marta Gálvez',
      compras: 9
    },
    {
      nombre: 'Carlos Mendoza',
      compras: 6
    },
    {
      nombre: 'Diego Salazar',
      compras: 5
    }
  ];


  filtrarClientes(): void {

    const texto = this.busqueda.toLowerCase().trim();

    this.clientesFiltrados = this.clientes.filter(cliente => {

      const coincideTexto =
        cliente.nombre.toLowerCase().includes(texto) ||
        cliente.telefono.toLowerCase().includes(texto) ||
        cliente.email.toLowerCase().includes(texto);

      const coincideEstado =
        this.estadoSeleccionado === 'Todos' ||
        cliente.estado === this.estadoSeleccionado;

      return coincideTexto && coincideEstado;
    });
  }


  obtenerIniciales(nombre: string): string {

    const palabras = nombre.split(' ');

    return palabras
      .slice(0, 2)
      .map(palabra => palabra.charAt(0))
      .join('')
      .toUpperCase();
  }


  nuevoCliente(): void {
    console.log('Nuevo cliente');
  }


  verCliente(cliente: Cliente): void {
    console.log('Ver cliente:', cliente);
  }


  editarCliente(cliente: Cliente): void {
    console.log('Editar cliente:', cliente);
  }


  eliminarCliente(cliente: Cliente): void {

    const confirmar = confirm(
      `¿Deseas eliminar al cliente ${cliente.nombre}?`
    );

    if (!confirmar) {
      return;
    }

    this.clientes = this.clientes.filter(
      c => c !== cliente
    );

    this.filtrarClientes();
  }
}

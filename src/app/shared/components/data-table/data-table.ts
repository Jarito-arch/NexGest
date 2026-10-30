import { Component, input, output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  /** Tipo de dato del campo (Texto, Número, Moneda, Fecha, Hora, Booleano, ...). */
  tipo?: string;
}

export interface TableSort {
  key: string;
  dir: 'asc' | 'desc';
}

export type TableRow = { id: string } & Record<string, unknown>;

/** Da formato legible a un valor según su tipo de campo. */
export function formatearValor(valor: unknown, tipo?: string): string {
  if (tipo === 'Booleano') return valor ? 'Sí' : 'No';
  if (valor === null || valor === undefined || valor === '') return '—';
  switch (tipo) {
    case 'Moneda': {
      const n = Number(valor);
      return isNaN(n) ? String(valor) : 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    case 'Número': {
      const n = Number(valor);
      return isNaN(n) ? String(valor) : n.toLocaleString('es-PE');
    }
    case 'Fecha': {
      const [y, m, d] = String(valor).split('-');
      return y && m && d ? `${d}/${m}/${y}` : String(valor);
    }
    default:
      return String(valor);
  }
}

@Component({
  selector: 'app-data-table',
  styleUrl: './data-table.css',
  templateUrl: './data-table.html',
})
export class DataTable {
  columnas = input.required<TableColumn[]>();
  filas = input.required<TableRow[]>();
  orden = input<TableSort | null>(null);
  /** Texto accesible que describe la tabla. */
  descripcion = input('Tabla de registros');
  /** Sin botones de editar ni eliminar (empleados). */
  soloLectura = input(false);

  ordenar = output<string>();
  editar = output<TableRow>();
  eliminar = output<TableRow>();

  formato = formatearValor;

  ariaSort(key: string): 'ascending' | 'descending' | 'none' {
    const o = this.orden();
    return o?.key === key ? (o.dir === 'asc' ? 'ascending' : 'descending') : 'none';
  }

  iconoOrden(key: string): string {
    const o = this.orden();
    if (o?.key !== key) return 'bi-chevron-expand';
    return o.dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
  }
}

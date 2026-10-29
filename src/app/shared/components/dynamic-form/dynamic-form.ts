import { Component, OnInit, input, output, signal } from '@angular/core';

export interface FormFieldDef {
  key: string;
  label: string;
  /** Texto, Número, Moneda, Fecha, Hora, Booleano, Selección, Archivo o Relación. */
  tipo: string;
  opciones?: string[];
  requerido?: boolean;
}

let siguienteId = 0;

/** Formulario generado a partir de una lista de campos, con validación y un control por tipo. */
@Component({
  selector: 'app-dynamic-form',
  styleUrl: './dynamic-form.css',
  templateUrl: './dynamic-form.html',
})
export class DynamicForm implements OnInit {
  campos = input.required<FormFieldDef[]>();
  /** Valores iniciales (al editar un registro). */
  valores = input<Record<string, unknown> | null>(null);
  etiquetaGuardar = input('Guardar');

  guardar = output<Record<string, unknown>>();
  cancelar = output<void>();

  readonly uid = `df${siguienteId++}`;
  datos = signal<Record<string, unknown>>({});
  errores = signal<Record<string, string>>({});

  ngOnInit(): void {
    const inicial = this.valores() ?? {};
    const datos: Record<string, unknown> = {};
    for (const campo of this.campos()) {
      datos[campo.key] = inicial[campo.key] ?? (campo.tipo === 'Booleano' ? false : '');
    }
    this.datos.set(datos);
  }

  idDe(campo: FormFieldDef): string {
    return `${this.uid}-${campo.key}`;
  }

  poner(key: string, valor: unknown): void {
    this.datos.update(actual => ({ ...actual, [key]: valor }));
    if (this.errores()[key]) {
      const restantes = { ...this.errores() };
      delete restantes[key];
      this.errores.set(restantes);
    }
  }

  ponerTexto(key: string, event: Event): void {
    this.poner(key, (event.target as HTMLInputElement).value);
  }

  ponerNumero(key: string, event: Event): void {
    const valor = (event.target as HTMLInputElement).valueAsNumber;
    this.poner(key, isNaN(valor) ? '' : valor);
  }

  ponerBooleano(key: string, event: Event): void {
    this.poner(key, (event.target as HTMLInputElement).checked);
  }

  ponerArchivo(key: string, event: Event): void {
    // Simulación sin backend: solo se conserva el nombre del archivo elegido.
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (archivo) this.poner(key, archivo.name);
  }

  quitarArchivo(key: string): void {
    this.poner(key, '');
  }

  enviar(event: Event): void {
    event.preventDefault();
    const errores = this.validar();
    this.errores.set(errores);
    if (Object.keys(errores).length) return;
    this.guardar.emit(this.limpiar());
  }

  private validar(): Record<string, string> {
    const errores: Record<string, string> = {};
    const datos = this.datos();
    for (const campo of this.campos()) {
      const valor = datos[campo.key];
      const vacio = valor === '' || valor === null || valor === undefined;
      if (campo.requerido && (vacio || (typeof valor === 'string' && !valor.trim()))) {
        errores[campo.key] = `Completa el campo «${campo.label}»`;
        continue;
      }
      if (vacio) continue;
      if ((campo.tipo === 'Número' || campo.tipo === 'Moneda') && typeof valor !== 'number') {
        errores[campo.key] = 'Ingresa un número válido';
      } else if (campo.tipo === 'Moneda' && (valor as number) < 0) {
        errores[campo.key] = 'El monto no puede ser negativo';
      } else if (campo.tipo === 'Selección' && campo.opciones?.length && !campo.opciones.includes(String(valor))) {
        errores[campo.key] = 'Elige una de las opciones';
      }
    }
    return errores;
  }

  private limpiar(): Record<string, unknown> {
    const salida: Record<string, unknown> = {};
    for (const [key, valor] of Object.entries(this.datos())) {
      salida[key] = typeof valor === 'string' ? valor.trim() : valor;
    }
    return salida;
  }
}

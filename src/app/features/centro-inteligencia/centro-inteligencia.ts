import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Inteligencia, Periodo, ResumenInteligencia } from '../../core/services/inteligencia';

const ANCHO = 640;
const ALTO = 260;
const MARGEN = { izq: 56, der: 16, arr: 16, abajo: 32 };

@Component({
  imports: [RouterLink],
  selector: 'app-centro-inteligencia',
  styleUrl: './centro-inteligencia.css',
  templateUrl: './centro-inteligencia.html',
})
export class CentroInteligencia implements OnInit {
  private servicio = inject(Inteligencia);
  private ultimaCarga = 0;

  readonly periodos: { valor: Periodo; etiqueta: string }[] = [
    { valor: 7, etiqueta: '7 días' },
    { valor: 30, etiqueta: '30 días' },
    { valor: 90, etiqueta: '90 días' },
  ];
  readonly ancho = ANCHO;
  readonly alto = ALTO;

  periodo = signal<Periodo>(30);
  datos = signal<ResumenInteligencia | null>(null);
  cargando = signal(true);
  error = signal(false);

  /** Geometría del gráfico de tendencia, calculada a partir de los datos. */
  grafico = computed(() => {
    const tendencia = this.datos()?.tendencia ?? [];
    if (!tendencia.length) return null;
    const maximo = Math.max(...tendencia.flatMap((p) => [p.actual, p.anterior]));
    const tope = this.redondear(maximo);
    const w = ANCHO - MARGEN.izq - MARGEN.der;
    const h = ALTO - MARGEN.arr - MARGEN.abajo;
    const x = (i: number) => MARGEN.izq + (tendencia.length === 1 ? w / 2 : (i * w) / (tendencia.length - 1));
    const y = (v: number) => MARGEN.arr + h - (v / tope) * h;
    const linea = (valores: number[]) =>
      valores.map((v, i) => (i === 0 ? `M ${x(i)} ${y(v)}` : `L ${x(i)} ${y(v)}`)).join(' ');
    const actual = tendencia.map((p) => p.actual);
    return {
      lineas: [0, 1, 2, 3, 4].map((i) => ({ y: MARGEN.arr + (h * i) / 4, etiqueta: this.corto(tope - (tope * i) / 4) })),
      actual: linea(actual),
      area: `${linea(actual)} L ${x(actual.length - 1)} ${MARGEN.arr + h} L ${x(0)} ${MARGEN.arr + h} Z`,
      anterior: linea(tendencia.map((p) => p.anterior)),
      puntos: tendencia.map((p, i) => ({ x: x(i), y: y(p.actual), etiqueta: p.etiqueta, valor: p.actual })),
      base: ALTO - 8,
    };
  });

  maximoCategoria = computed(() => Math.max(1, ...(this.datos()?.categorias ?? []).map((c) => c.valor)));

  ngOnInit(): void {
    this.cargar();
  }

  elegir(periodo: Periodo): void {
    if (periodo === this.periodo()) return;
    this.periodo.set(periodo);
    this.cargar();
  }

  async cargar(): Promise<void> {
    const turno = ++this.ultimaCarga;
    this.cargando.set(true);
    this.error.set(false);
    try {
      const resumen = await this.servicio.obtener(this.periodo());
      if (turno !== this.ultimaCarga) return; // llegó una respuesta más nueva
      this.datos.set(resumen);
    } catch {
      if (turno === this.ultimaCarga) this.error.set(true);
    } finally {
      if (turno === this.ultimaCarga) this.cargando.set(false);
    }
  }

  texto(variacion: number, unidad: '%' | 'pts'): string {
    const signo = variacion > 0 ? '+' : variacion < 0 ? '−' : '';
    return `${signo}${Math.abs(variacion).toLocaleString('es-PE')}${unidad === '%' ? '%' : ' pts'}`;
  }

  /** 'bueno', 'malo' o 'neutro' según si el cambio es favorable para el negocio. */
  clase(variacion: number, altoEsBueno: boolean): 'bueno' | 'malo' | 'neutro' {
    if (variacion === 0) return 'neutro';
    return variacion > 0 === altoEsBueno ? 'bueno' : 'malo';
  }

  soles(valor: number): string {
    return 'S/ ' + valor.toLocaleString('es-PE');
  }

  private corto(valor: number): string {
    return valor >= 1000 ? `${(valor / 1000).toLocaleString('es-PE', { maximumFractionDigits: 1 })}k` : String(Math.round(valor));
  }

  private redondear(maximo: number): number {
    const paso = maximo > 20000 ? 5000 : maximo > 5000 ? 2000 : maximo > 1000 ? 500 : 200;
    return Math.ceil(maximo / paso) * paso;
  }
}

import { Component, ElementRef, HostListener, OnDestroy, PLATFORM_ID, afterNextRender, inject, input, output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

let siguienteId = 0;

/** Modal accesible: cierra con Esc o al hacer clic fuera, atrapa el foco y lo devuelve al cerrar. */
@Component({
  selector: 'app-dialog',
  styleUrl: './dialog.css',
  templateUrl: './dialog.html',
})
export class Dialog implements OnDestroy {
  titulo = input.required<string>();
  /** Ancho máximo en px. */
  ancho = input(520);
  cerrar = output<void>();

  readonly tituloId = `dialog-titulo-${siguienteId++}`;

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private anterior: HTMLElement | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) this.anterior = document.activeElement as HTMLElement | null;
    afterNextRender(() => {
      const interior = this.el.nativeElement.querySelector<HTMLElement>('.dialog');
      const primero = this.enfocables()[0] ?? interior;
      primero?.focus();
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) this.anterior?.focus?.();
  }

  @HostListener('document:keydown', ['$event'])
  teclado(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cerrar.emit();
      return;
    }
    if (event.key !== 'Tab') return;
    const lista = this.enfocables();
    if (!lista.length) return;
    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    const activo = document.activeElement;
    if (event.shiftKey && (activo === primero || !this.el.nativeElement.contains(activo))) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && (activo === ultimo || !this.el.nativeElement.contains(activo))) {
      event.preventDefault();
      primero.focus();
    }
  }

  private enfocables(): HTMLElement[] {
    const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>(selector));
  }
}

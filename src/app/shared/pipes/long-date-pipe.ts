import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longDate',
})
export class LongDatePipe implements PipeTransform {
  private readonly formatter = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'  
  });

  transform(value: Date | string | number | null | undefined): string {
    if (value == null) return '';

    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) return '';

    const partes = this.formatter.formatToParts(fecha);
    const get = (tipo: string) => partes.find(p => p.type === tipo)?.value ?? '';
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return `${cap(get('weekday'))} ${get('day')} de ${cap(get('month'))}`;
  }
}

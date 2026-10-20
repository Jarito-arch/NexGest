import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss'
})
export class TopBar implements OnDestroy {

  tituloPagina: string = 'Dashboard';

  fechaActual: string = '';

  private intervaloFecha?: ReturnType<typeof setInterval>;


  constructor(private router: Router) {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {

        this.cambiarTitulo(event.urlAfterRedirects);

      });


    this.cambiarTitulo(this.router.url);

    this.actualizarFecha();


    this.intervaloFecha = setInterval(() => {

      this.actualizarFecha();

    }, 60000);
  }

  cambiarTitulo(url: string): void {

    if (url.includes('/clientes')) {

      this.tituloPagina = 'Clientes';

    } else if (url.includes('/inventario')) {

      this.tituloPagina = 'Inventario';

    } else if (url.includes('/ventas')) {

      this.tituloPagina = 'Ventas';

    } else if (url.includes('/finanzas')) {

      this.tituloPagina = 'Finanzas';

    } else if (url.includes('/proveedores')) {

      this.tituloPagina = 'Proveedores';

    } else if (url.includes('/dashboard')) {

      this.tituloPagina = 'Dashboard';

    } else {

      this.tituloPagina = 'Dashboard';

    }
  }

  actualizarFecha(): void {

    const ahora = new Date();

    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };

    let fecha = new Intl.DateTimeFormat(
      'es-PE',
      opciones
    ).format(ahora);


    fecha =
      fecha.charAt(0).toUpperCase() +
      fecha.slice(1);


    this.fechaActual = fecha;
  }

  ngOnDestroy(): void {

    if (this.intervaloFecha) {
      clearInterval(this.intervaloFecha);
    }

  }

}
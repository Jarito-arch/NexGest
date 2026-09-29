import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss'
})
export class TopBar {

  tituloPagina: string = 'Dashboard';

  constructor(private router: Router) {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {

        console.log('Ruta actual:', event.urlAfterRedirects);

        this.cambiarTitulo(event.urlAfterRedirects);

      });

    this.cambiarTitulo(this.router.url);
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
}

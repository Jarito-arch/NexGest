import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout de las pantallas públicas. La landing ya trae su propia cabecera, así que
 * este layout se mantiene mínimo para no duplicar la barra.
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-public-layout',
  styleUrl: './public-layout.css',
  templateUrl: './public-layout.html',
})
export class PublicLayout {}

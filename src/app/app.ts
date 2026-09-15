import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar'; 
import { TopBar } from './shared/components/top-bar/top-bar';

@Component({
  imports: [Sidebar, TopBar],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('nexgest-angular');
}

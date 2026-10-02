import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebarComponent/sidebar'; 
import { TopBar } from './shared/components/topbarComponent/top-bar';

@Component({
  imports: [Sidebar, TopBar, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('nexgest-angular');
}

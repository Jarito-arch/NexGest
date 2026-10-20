import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Tenant } from '../../../core/services/tenant';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly customModules = inject(Tenant).customModules;
}

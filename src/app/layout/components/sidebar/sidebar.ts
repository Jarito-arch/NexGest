import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Tenant } from '../../../core/services/tenant';
import { Permisos } from '../../../core/services/permisos';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly permisos = inject(Permisos);
  private readonly tenant = inject(Tenant);

  /** Solo los módulos propios a los que la persona tiene acceso. */
  readonly customModules = computed(() => this.tenant.customModules().filter((m) => this.permisos.puedeVer(`custom:${m.id}`)));
}

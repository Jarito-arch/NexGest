import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<div class="dashboard-placeholder"></div>`,
  styles: [
    `
      .dashboard-placeholder {
        min-height: 100vh;
        background: #050909;
      }
    `,
  ],
})
export class Dashboard {}

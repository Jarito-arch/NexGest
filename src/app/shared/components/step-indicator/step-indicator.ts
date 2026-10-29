import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './step-indicator.html',
  styleUrl: './step-indicator.scss',
})
export class StepIndicatorComponent {
  @Input() currentStep: number = 1;

  checkIcon = lucideCheck;

  steps = [
    { number: '01', title: 'Tu negocio' },
    { number: '02', title: 'Cómo trabajas' },
    { number: '03', title: 'Módulos' },
    { number: '04', title: 'Objetivos' },
    { number: '05', title: 'Configuración' },
  ];
}

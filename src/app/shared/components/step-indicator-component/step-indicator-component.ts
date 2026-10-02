import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({

  selector: 'app-step-indicator',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './step-indicator-component.html',

  styleUrl: './step-indicator-component.scss'

})


export class StepIndicatorComponent {


  @Input() currentStep: number = 1;



  steps = [

    {
      number: '01',
      title: 'Tu negocio'
    },

    {
      number: '02',
      title: 'Cómo trabajas'
    },

    {
      number: '03',
      title: 'Módulos'
    },

    {
      number: '04',
      title: 'Objetivos'
    },

    {
      number: '05',
      title: 'Configuración'
    }

  ];


}
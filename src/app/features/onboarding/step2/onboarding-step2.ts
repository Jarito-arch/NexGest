import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../core/onboarding.service';


import { OnboardingLayoutComponent } 
from '../../shared/components/onboarding-layout-component/onboarding-layout-component';


import { StepIndicatorComponent } 
from '../../shared/components/step-indicator-component/step-indicator-component';


import { OnboardingCardComponent } 
from '../../shared/components/onboarding-card-component/onboarding-card-component';


import { CheckboxOptionComponent } 
from '../../shared/components/checkbox-option-component/checkbox-option-component';


import { PrimaryButtonComponent } 
from '../../shared/components/primary-button-component/primary-button-component';



@Component({

  selector: 'app-onboarding-step2',

  standalone:true,


  imports:[

    OnboardingLayoutComponent,

    StepIndicatorComponent,

    OnboardingCardComponent,

    CheckboxOptionComponent,

    PrimaryButtonComponent

  ],


  templateUrl:'./onboarding-step2.html',

  styleUrl:'./onboarding-step2.scss'

})


export class OnboardingStep2 {

  state = inject(OnboardingService);
  private router = inject(Router);

  valid = computed(() => this.state.activities().length > 0 && !!this.state.frequency());

  back() {
    this.router.navigate(['/onboarding/step1']);
  }

  next() {
    if (this.valid()) this.router.navigate(['/onboarding/step3']);
  }



  activities = [

    'Vendo productos',

    'Compro productos a proveedores',

    'Manejo inventario',

    'Atiendo clientes',

    'Registro ingresos y gastos',

    'Ofrezco servicios',

    'Realizo pedidos',

    'Hago entregas',

    'Otra'

  ];





  frequencies = [

    'Diariamente',

    'Varias veces por semana',

    'Semanalmente',

    'Solo cuando es necesario'

  ];



}
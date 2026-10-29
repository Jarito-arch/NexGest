import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  lucideShoppingCart,
  lucidePackage,
  lucideUsers,
  lucideTruck,
  lucideChartColumn,
  lucideWallet,
} from '@ng-icons/lucide';

import { OnboardingLayoutComponent } from '../../shared/components/onboarding-layout-component/onboarding-layout-component';
import { StepIndicatorComponent } from '../../shared/components/step-indicator-component/step-indicator-component';
import { OnboardingCardComponent } from '../../shared/components/onboarding-card-component/onboarding-card-component';
import { OptionCardComponent } from '../../shared/components/option-card-component/option-card-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';
import { OnboardingService } from '../../core/onboarding.service';

@Component({
  selector: 'app-onboarding-step3',
  standalone: true,
  imports: [
    OnboardingLayoutComponent,
    StepIndicatorComponent,
    OnboardingCardComponent,
    OptionCardComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './onboarding-step3.html',
  styleUrls: ['../onboarding-shared.scss', './onboarding-step3.scss'],
})
export class OnboardingStep3 {
  state = inject(OnboardingService);
  private router = inject(Router);

  modules = [
    { icon: lucideShoppingCart, title: 'Ventas' },
    { icon: lucidePackage, title: 'Inventario' },
    { icon: lucideUsers, title: 'Clientes' },
    { icon: lucideTruck, title: 'Compras' },
    { icon: lucideChartColumn, title: 'Reportes' },
    { icon: lucideWallet, title: 'Finanzas' },
  ];

  valid = computed(() => this.state.modules().length > 0);

  back() {
    this.router.navigate(['/onboarding/step2']);
  }

  next() {
    if (this.valid()) this.router.navigate(['/onboarding/step4']);
  }
}

import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  lucideLayoutDashboard,
  lucideClock,
  lucideTrendingUp,
  lucideReceipt,
} from '@ng-icons/lucide';

import { OnboardingLayoutComponent } from '../../shared/components/onboarding-layout-component/onboarding-layout-component';
import { StepIndicatorComponent } from '../../shared/components/step-indicator-component/step-indicator-component';
import { OnboardingCardComponent } from '../../shared/components/onboarding-card-component/onboarding-card-component';
import { OptionCardComponent } from '../../shared/components/option-card-component/option-card-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';
import { OnboardingService } from '../../core/onboarding.service';

@Component({
  selector: 'app-onboarding-step4',
  standalone: true,
  imports: [
    OnboardingLayoutComponent,
    StepIndicatorComponent,
    OnboardingCardComponent,
    OptionCardComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './onboarding-step4.html',
  styleUrls: ['../onboarding-shared.scss', './onboarding-step4.scss'],
})
export class OnboardingStep4 {
  state = inject(OnboardingService);
  private router = inject(Router);

  goals = [
    { icon: lucideLayoutDashboard, title: 'Organizar mi negocio' },
    { icon: lucideClock, title: 'Ahorrar tiempo' },
    { icon: lucideTrendingUp, title: 'Aumentar mis ventas' },
    { icon: lucideReceipt, title: 'Controlar mis gastos' },
  ];

  valid = computed(() => this.state.goals().length > 0);

  back() {
    this.router.navigate(['/onboarding/step3']);
  }

  next() {
    if (this.valid()) this.router.navigate(['/onboarding/step5']);
  }
}

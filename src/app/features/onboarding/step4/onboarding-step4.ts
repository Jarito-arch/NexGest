import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  lucideLayoutDashboard,
  lucideClock,
  lucideTrendingUp,
  lucideReceipt,
} from '@ng-icons/lucide';

import { OnboardingLayoutComponent } from '../../../layout/onboarding-layout/onboarding-layout';
import { StepIndicatorComponent } from '../../../shared/components/step-indicator/step-indicator';
import { OnboardingCardComponent } from '../../../shared/components/onboarding-card/onboarding-card';
import { OptionCardComponent } from '../../../shared/components/option-card/option-card';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button';
import { OnboardingService } from '../../../core/services/onboarding-state';

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

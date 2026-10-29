import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { lucidePartyPopper } from '@ng-icons/lucide';

import { OnboardingLayoutComponent } from '../../shared/components/onboarding-layout-component/onboarding-layout-component';
import { StepIndicatorComponent } from '../../shared/components/step-indicator-component/step-indicator-component';
import { OnboardingCardComponent } from '../../shared/components/onboarding-card-component/onboarding-card-component';
import { PrimaryButtonComponent } from '../../shared/components/primary-button-component/primary-button-component';
import { OnboardingService } from '../../core/onboarding.service';

@Component({
  selector: 'app-onboarding-step5',
  standalone: true,
  imports: [
    NgIcon,
    OnboardingLayoutComponent,
    StepIndicatorComponent,
    OnboardingCardComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './onboarding-step5.html',
  styleUrls: ['../onboarding-shared.scss', './onboarding-step5.scss'],
})
export class OnboardingStep5 {
  state = inject(OnboardingService);
  private router = inject(Router);

  partyIcon = lucidePartyPopper;

  finish() {
    this.router.navigate(['/dashboard']);
  }
}

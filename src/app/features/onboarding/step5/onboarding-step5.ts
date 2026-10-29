import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { lucidePartyPopper } from '@ng-icons/lucide';

import { OnboardingLayoutComponent } from '../../../layout/onboarding-layout/onboarding-layout';
import { StepIndicatorComponent } from '../../../shared/components/step-indicator/step-indicator';
import { OnboardingCardComponent } from '../../../shared/components/onboarding-card/onboarding-card';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button';
import { Auth } from '../../../core/services/auth';
import { OnboardingService } from '../../../core/services/onboarding-state';

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
  private auth = inject(Auth);
  private router = inject(Router);

  partyIcon = lucidePartyPopper;

  finish() {
    this.auth.completeOnboarding();
    this.router.navigate(['/dashboard']);
  }
}

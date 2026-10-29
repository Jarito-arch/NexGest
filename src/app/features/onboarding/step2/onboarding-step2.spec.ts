import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingStep2 } from './onboarding-step2';

describe('OnboardingStep2', () => {
  let component: OnboardingStep2;
  let fixture: ComponentFixture<OnboardingStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingStep2],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingStep2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

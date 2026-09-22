import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanAccion } from './plan-accion';

describe('PlanAccion', () => {
  let component: PlanAccion;
  let fixture: ComponentFixture<PlanAccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanAccion],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanAccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

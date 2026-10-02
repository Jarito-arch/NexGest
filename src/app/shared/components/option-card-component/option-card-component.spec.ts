import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionCardComponent } from './option-card-component';

describe('OptionCardComponent', () => {
  let component: OptionCardComponent;
  let fixture: ComponentFixture<OptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

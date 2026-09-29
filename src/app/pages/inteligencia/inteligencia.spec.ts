import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inteligencia } from './inteligencia';

describe('Inteligencia', () => {
  let component: Inteligencia;
  let fixture: ComponentFixture<Inteligencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inteligencia]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Inteligencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

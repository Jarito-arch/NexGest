import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructorModulos } from './constructor-modulos';

describe('ConstructorModulos', () => {
  let component: ConstructorModulos;
  let fixture: ComponentFixture<ConstructorModulos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructorModulos]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConstructorModulos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

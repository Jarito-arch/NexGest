import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomModules } from './custom-modules';

describe('CustomModules', () => {
  let component: CustomModules;
  let fixture: ComponentFixture<CustomModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomModules],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomModules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

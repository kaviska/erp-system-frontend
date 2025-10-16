import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesTestComponent } from './employees-test.component';

describe('EmployeesTestComponent', () => {
  let component: EmployeesTestComponent;
  let fixture: ComponentFixture<EmployeesTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTestComponent } from './accounts-test.component';

describe('AccountsTestComponent', () => {
  let component: AccountsTestComponent;
  let fixture: ComponentFixture<AccountsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

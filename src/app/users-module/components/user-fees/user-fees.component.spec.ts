import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeesComponent } from './user-fees.component';

describe('UserFeesComponent', () => {
  let component: UserFeesComponent;
  let fixture: ComponentFixture<UserFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLoansComponent } from './history-loans.component';

describe('HistoryLoansComponent', () => {
  let component: HistoryLoansComponent;
  let fixture: ComponentFixture<HistoryLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

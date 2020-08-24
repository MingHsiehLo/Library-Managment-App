// Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Components
import { LoansComponent } from './components/loans/loans.component';
import { HistoryLoansComponent } from './components/history-loans/history-loans.component';


@NgModule({
  declarations: [
    LoansComponent,
    HistoryLoansComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: LoansComponent },
      { path: 'history', component: HistoryLoansComponent }
    ])
  ]
})
export class LoanModule { }

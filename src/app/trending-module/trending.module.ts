// Modules
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

// Components
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    ChartsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: ReportsComponent }
    ])
  ]
})
export class TrendingModule { }

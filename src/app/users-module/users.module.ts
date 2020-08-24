// Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

// Components
import { UsersComponent } from './components/users/users.component';
import { UserFeesComponent } from './components/user-fees/user-fees.component';
import { UserLoansComponent } from './components/user-loans/user-loans.component';


@NgModule({
  declarations: [
    UsersComponent,
    UserFeesComponent,
    UserLoansComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: UsersComponent },
      { path: 'loans', component: UserLoansComponent },
      { path: 'history', component: UserFeesComponent }
    ])
  ]
})
export class UsersModule { }

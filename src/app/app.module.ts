import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { BooksComponent } from './components/books/books.component';
import { HomeComponent } from './components/home/home.component';
import { BannerComponent } from './components/banner/banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { StudentsComponent } from './components/students/students.component';
import { AuthorComponent } from './components/author/author.component';
import { GenreComponent } from './components/genre/genre.component';
import { PublisherComponent } from './components/publisher/publisher.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ReportsComponent } from './components/reports/reports.component';
import { FeesComponent } from './components/fees/fees.component';
import { ChartsModule } from 'ng2-charts';
import { LoansComponent } from './components/loans/loans.component';
import { HistoryLoansComponent } from './components/history-loans/history-loans.component';
import { UserLoansComponent } from './components/user-loans/user-loans.component';
import { UserFeesComponent } from './components/user-fees/user-fees.component';
import { ConvertToNoDataPipe } from './components/user-loans/convert-to-nodata.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    HomeComponent,
    BannerComponent,
    FooterComponent,
    StudentsComponent,
    AuthorComponent,
    GenreComponent,
    PublisherComponent,
    LoginComponent,
    ReportsComponent,
    FeesComponent,
    LoansComponent,
    HistoryLoansComponent,
    UserLoansComponent,
    UserFeesComponent,
    ConvertToNoDataPipe
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
      {path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService]},
      {path: 'books', component: BooksComponent, canActivate: [AuthGuardService]},
      {path: 'genre', component: GenreComponent, canActivate: [AuthGuardService]},
      {path: 'publisher', component: PublisherComponent, canActivate: [AuthGuardService]},
      {path: 'author', component: AuthorComponent, canActivate: [AuthGuardService]},
      {path: 'students', component: StudentsComponent, canActivate: [AuthGuardService]},
      {path: 'loans', component: LoansComponent, canActivate: [AuthGuardService]},
      {path: 'history-loans', component: HistoryLoansComponent, canActivate: [AuthGuardService]},
      {path: 'user-loans', component: UserLoansComponent, canActivate: [AuthGuardService]},
      {path: 'user-fees', component: UserFeesComponent, canActivate: [AuthGuardService]},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]),
    JwtModule.forRoot({
      config: {}
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

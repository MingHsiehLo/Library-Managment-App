// Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

// Services
import { HomeResolverService } from './services/home-resolver.service';
import { AuthGuardService } from './services/auth.guard';
import { SelectiveStrategyService } from './services/selective-strategy.service';
import { BooksResolverService } from './services/books-resolver.service';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'home', component: HomeComponent, resolve: { resolveHome: HomeResolverService } },
      {
        path: 'books',
        canActivate: [AuthGuardService],
        resolve: { resolveBooks: BooksResolverService },
        data: { preload: true },
        loadChildren: () => import('./book-module/book.module').then(m => m.BookModule)
      },
      {
        path: 'users',
        canActivate: [AuthGuardService],
        data: { preload: false },
        loadChildren: () => import('./users-module/users.module').then(m => m.UsersModule)
      },
      {
        path: 'loans',
        canActivate: [AuthGuardService],
        data: { preload: true },
        loadChildren: () => import('./loan-module/loan.module').then(m => m.LoanModule)
      },
      {
        path: 'reports',
        canActivate: [AuthGuardService],
        data: { preload: true },
        loadChildren: () => import('./trending-module/trending.module').then(m => m.TrendingModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ], { preloadingStrategy: SelectiveStrategyService })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogged(state.url);
  }

  checkLogged(url: string): boolean {
    if (this.auth.isAuthenticated()) {
      this.auth.redirectUrl = url;
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

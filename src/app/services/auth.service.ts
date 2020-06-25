import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private savedUser = new Subject<any>();
  private isUserAuthenticated = new Subject<boolean>();
  private isUserAdmin = new Subject<boolean>();

  constructor(private jwtHelper: JwtHelperService) {
      this.jwtHelper = new JwtHelperService();
      this.isUserAuthenticated.next(false);
      this.isUserAdmin.next(false);
  }

  isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      let isTokenExpired: boolean = true;

      if(token !== null && token !== undefined) {
          isTokenExpired = this.jwtHelper.isTokenExpired(token);
          this.isUserAuthenticated.next(true);
      }

      return isTokenExpired;
  }

  displayMenu(): Observable<boolean> {
    return this.isUserAuthenticated.asObservable();
  }

  retrieveUserType(): boolean {
    const type = localStorage.getItem('userType');
    if (type === 'Admin') {
      return true;
    }
    else {
      return false;
    }
  }

  saveUserInfo(data){
    localStorage.setItem('userId', data.id);
    localStorage.setItem('status', data.status);
    this.savedUser.next(data);
  }

  retrieveUserInfo(){
    return this.savedUser.asObservable();
  }

  setUserType(type: string) {
    localStorage.setItem('userType', type);
  }

  createToken(token: string) {
    localStorage.setItem('token', token);
  }

}

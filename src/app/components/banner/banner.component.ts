import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {

  isCollapsed = true;
  userInfoSubscription: any;
  subscription: any;
  isUserExpired: boolean;
  userAdmin: boolean;
  userInfo = {
    firstName: null,
    lastName: null
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.subscription = this.authService.displayMenu().subscribe({
      next: isLogged => {
        this.isUserExpired = isLogged;
      },
      error: err => console.log(`Error: ${err}`)
    });

    this.userInfoSubscription = this.authService.retrieveUserInfo().subscribe({
      next: data => {
        if (data !== null && data !== undefined) {
          localStorage.setItem('firstName', data.firstName);
          localStorage.setItem('lastName', data.lastName);
          this.setUserName();
        }
      },
      error: err => console.log(`Error: ${err}`)
    });


    if (this.userInfo.firstName === null && this.userInfo.lastName === null) {
      this.setUserName();
    }

  }

  setUserName(){
    this.userInfo.firstName = localStorage.getItem('firstName');
    this.userInfo.lastName = localStorage.getItem('lastName');
    this.userAdmin = this.authService.retrieveUserType();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userInfoSubscription.unsubscribe();
  }

  logOut() {
    this.isUserExpired = false;
    localStorage.setItem('token', null);
    localStorage.setItem('userId', null);
    localStorage.setItem('userType', null);
    localStorage.setItem('firstName', null);
    localStorage.setItem('lastName', null);
    localStorage.setItem('status', null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}

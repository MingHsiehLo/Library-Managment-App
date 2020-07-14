import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  _email: string;
  _pass: string;
  message: string;
  _first_name: string;
  emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  serverMessage: string;
  transition = false;
  mobileTransitionVal = false;

  get first_name(){
    return this._first_name
  }

  set first_name(value){
    this._first_name = value;
    this.unsuccessful = false;
  }

  _last_name: string;

  get last_name(){
    return this._last_name
  }

  set last_name(value){
    this._last_name = value;
    this.unsuccessful = false;
  }

  _emailSign: string;

  get emailSign(){
    return this._emailSign
  }

  set emailSign(value){
    this._emailSign = value;
    this.unsuccessful = false;
  }

  _pass_sign: string;

  get pass_sign(){
    return this._pass_sign;
  }

  set pass_sign(value){
    this._pass_sign = value;
    this.unsuccessful = false;
  }

  messageError = false;
  signUpError = false;
  unsuccessful = false;
  dataPosted = false;

  loggedInUser = {
    id: null,
    firstName: null,
    lastName: null,
    status: null
  };

  signInInfo: any = {
    id_students: null,
    _first_name: null,
    last_name: null,
    status: null,
    email: null,
    password: null,
    phone_number: null
  };

  get pass(){
    return this._pass;
  }

  set pass(value){
    this._pass = value;
    this.messageError = false;
  }

  get email(){
    return this._email;
  }

  set email(value){
    this._email = value;
    this.messageError = false;
  }

  ngOnInit(){}

  constructor(private loginService: LoginService, private router: Router, private authService: AuthService) {
    this.message = '';
  }

  login() {
      this.message = '';
      this.loginService.login(this.email, this.pass).subscribe({
        next: data => {
          if (data.result === '200') {
            this.authService.createToken(data.message);
            this.authService.setUserType(data.userType);
            this.loggedInUser.firstName = data.firstName;
            this.loggedInUser.lastName = data.lastName;
            this.loggedInUser.status = data.status;
            this.loggedInUser.id = data.id;
            this.authService.saveUserInfo(this.loggedInUser);
            this.router.navigate(['/home']);
          }
          else if (data.result === '404'){
            this.messageError = true;
          }
        },
        error: err => this.message = err.error.message
      });
  }

  check(form: NgForm){
    this.messageError = false;
    if (form.valid){
      this.login();
    }
  }

  newUser(form: NgForm){
    if (form.valid) {
      return new Promise((resolve, reject) => {
        this.signInInfo.first_name = this.first_name;
        this.signInInfo.last_name = this.last_name;
        this.signInInfo.email = this.emailSign;
        this.signInInfo.password = this.pass_sign;
        this.loginService.newUser(this.signInInfo).subscribe({
          next: data => {
            if (data.result === '200') {
              this.unsuccessful = false;
              this.dataPosted = true;
              form.resetForm();
            }
            else if (data.result === '404') {
              this.serverMessage = data.message;
              this.unsuccessful = true;
            }
            resolve(true);
          },
          error: err => this.message = err.error.message
        });
      });
    }
  }

  transitionOn(){
    this.transition = !this.transition;
  }

  mobileTransition(){
    this.mobileTransitionVal = !this.mobileTransitionVal;
  }

}

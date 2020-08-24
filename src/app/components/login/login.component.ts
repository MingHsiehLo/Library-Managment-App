import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime } from 'rxjs/operators';

function matchPass(c: AbstractControl): {[key: string]: boolean} | null {
  const pass = c.get('password');
  const repeatedPass = c.get('repeatPassword');

  if (pass.pristine || repeatedPass.pristine) {
    return null;
  }

  if (pass.value === repeatedPass.value) {
    return null;
  }
  return {match: true};
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('newSignUpForm') newSignUpForm: NgForm;
  @ViewChild('newMobileSignUpForm') newMobileSignUpForm: NgForm;

  hidden = false;
  togglePassMessage = 'Show';
  _email: string;
  _pass: string;
  message: string;
  _first_name: string;
  emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  serverMessage: string;
  transition = false;
  mobileTransitionVal = false;
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

  signUpForm: FormGroup;
  mobileSignUpForm: FormGroup;
  passErrorStatus = false;
  emailErrorStatus = false;

  constructor(private loginService: LoginService, private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.message = '';
  }

  ngOnInit(){
    this.createSignUpForm();
    this.createMobileSignUpForm();
  }

  togglePass(){
    this.hidden = !this.hidden;
    this.togglePassMessage = this.hidden ? 'Hide' : 'Show';
  }

  createMobileSignUpForm(){
    this.mobileSignUpForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      passwordGroup: this.fb.group({
        password: [null, [Validators.required]],
        repeatPassword: [null, [Validators.required]]
      }, {validator: matchPass})
    });
    const emailControl = this.mobileSignUpForm.get('email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe({
      next: data => this.validateEmail(emailControl)
    });
    const passwordControl = this.mobileSignUpForm.get('passwordGroup');
    const repeatPassword = this.mobileSignUpForm.get('passwordGroup.repeatPassword');
    repeatPassword.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe({
      next: data => this.validatePass(passwordControl)
    });
  }

  createSignUpForm(){
    this.signUpForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
      passwordGroup: this.fb.group({
        password: [null, [Validators.required]],
        repeatPassword: [null, [Validators.required]]
      }, {validator: matchPass})
    });
    const emailControl = this.signUpForm.get('email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe({
      next: data => this.validateEmail(emailControl)
    });
    const passwordControl = this.signUpForm.get('passwordGroup');
    const repeatPassword = this.signUpForm.get('passwordGroup.repeatPassword');
    repeatPassword.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe({
      next: data => this.validatePass(passwordControl)
    });
  }

  validateEmail(c: AbstractControl): void {
    if (c.dirty) {
      this.emailErrorStatus = true;
    }
    if (this.unsuccessful) {
      this.unsuccessful = !this.unsuccessful;
    }
  }

  validatePass(c: AbstractControl): void {
    if (c.dirty && c.touched) {
      this.passErrorStatus = true;
    }
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
            if (this.authService.redirectUrl) {
              this.router.navigateByUrl(this.authService.redirectUrl);
            } else {
              this.router.navigate(['/home']);
            }
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

  newUser(form: FormGroup){
    if (form.valid) {
      return new Promise((resolve, reject) => {
        this.loginService.newUser(form.value).subscribe({
          next: data => {
            if (data.result === '200') {
              this.unsuccessful = false;
              this.dataPosted = true;
              setTimeout(() => {
                this.dataPosted = false;
              }, 2000);
              this.createSignUpForm();
              this.createMobileSignUpForm();
              form.reset();
              form.clearValidators();
              this.newMobileSignUpForm.resetForm();
              this.newSignUpForm.resetForm();
              this.passErrorStatus = false;
              this.emailErrorStatus = false;
              setTimeout(() => {
                this.mobileTransitionVal = !this.mobileTransitionVal;
              }, 3000);
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

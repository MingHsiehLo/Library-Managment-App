import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { IStudent, Student, Fee, IPayment, IPaymentAll } from 'src/app/modal/modal';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { BooksService } from 'src/app/services/books.service';
import { FeeService } from 'src/app/services/fee.service';

import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-students',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  page = 1;
  pageSize = 4;
  collectionSize: number;

  get studentArray(): IStudent[] {
    return this.requestResult
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  tableTitles: string[];
  requestResult: IStudent[] = [];
  students: IStudent[] = [];
  userAdmin: boolean;
  edit: boolean = false;
  enableMessage: string = 'Enable Edit';
  fee: boolean = false;
  feeAmount: number;
  feeArray: Fee[] = [];


  payOb: IPayment = {
    id_students: null,
    id_loan: null,
    returned_date: null,
  }

  payObAll: IPaymentAll = {
    id_students: null,
    today: null
  }

  private _searchOptionInfo: string;
  searchOptionCategory: string = 'name';
  paymentAlert: boolean;
  paymentMessage: any;
  alertType: string;
  feeStatus: boolean = false;
  feeMessage: string;

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult = this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory) : this.students;
    this.collectionSize = this.requestResult.length;
  }

  selectedStudentInfo: IStudent = {
    id_students: null,
    password: null,
    first_name: null,
    last_name: null,
    status: null,
    phone_number: null,
    email: null,
    requested_books: null
  }

  originalStudentSettings: IStudent = {
    id_students: null,
    password: null,
    first_name: null,
    last_name: null,
    status: 'true',
    phone_number: null,
    email: null,
    requested_books: null
  }

  studentSettings: IStudent = { ...this.originalStudentSettings };
  studentAlert: boolean = false;
  studentMessage: string;
  pendingFeeArray: Fee[] = [];
  dueAmount: number = 0;
  pendingFee: boolean = false;

  constructor(private usersService: UsersService, private detectorService: ChangeDetectorRef,
    private authService: AuthService, private booksService: BooksService, private feeService: FeeService) { }

  ngOnInit(): void {
    this.userAdmin = this.authService.retrieveUserType();
    this.userAdmin ? this.tableTitles = ['ID', 'Password', 'Full Name', 'Status', 'Phone Number', 'Email'] : this.tableTitles = ['ID', 'Full Name', 'Status', 'Phone Number'];
    this.getStudents();
  }

  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready(function(){
      $('#newEntry').on('hide.bs.modal', function () {
        (document.querySelector("form[name='newEntry']") as HTMLFormElement).reset();
        thisComponent.studentSettings.status = 'true';
        thisComponent.detectorService.detectChanges();
      });
    })
  }

  performFilter(searchBy: string, category: string) {

    category === "name" || category === "email" ? searchBy = searchBy.toLowerCase() : searchBy;

    if (category === "name") {
      return this.students.filter(element => {
        let fullName = element.first_name + element.last_name;
        return fullName.toLowerCase().indexOf(searchBy) !== -1;
      })
    }
    else if (category === "phoneNumber") {
      return this.students.filter(element =>
        element.phone_number.toString().indexOf(searchBy) !== -1
      )
    }
    else if (category === "email") {
      return this.students.filter(element =>
        element.email.toLowerCase().indexOf(searchBy) !== -1
      )
    }
  }

  selectedStudent(data: Student) {
    this.fee = false;
    this.feeStatus = false;
    this.selectedStudentInfo = {...data}
    this.retrieveFees(this.selectedStudentInfo.id_students);
  }

  getStudents(){
    return new Promise ((resolve, reject) => {
      this.usersService.getInfo().subscribe({
        next: data => {
          this.requestResult = data;
          this.students = data;
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.collectionSize = this.requestResult.length);
  }

  postStudent(form: NgForm){
    if (form.valid) {
      return new Promise ((resolve, reject) => {
        this.usersService.postInfo(this.studentSettings).subscribe({
          next: data => {
            if(data.result === '200'){
              this.studentAlert = true;
              this.alertType = 'success';
              this.studentMessage = data.message;
              setTimeout(() => this.studentAlert = false, 3000);
            }
            else if (data.result === '404'){
              this.studentAlert = true;
              this.alertType = 'danger';
              this.studentMessage = data.message;
              setTimeout(() => this.studentAlert = false, 3000);
            }
            resolve(true);
          },
          error: error => { console.log(error), resolve(false) }
        })
      }).then(() => { this.getStudents(), this.clearEntry() });
    }
  }

  updateStudent(studentInfo: IStudent){
    return new Promise((resolve, reject) => {
      this.usersService.updateInfo(studentInfo).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.studentAlert = true;
            this.alertType = 'success';
            this.studentMessage = 'User information successfully modified.';
            setTimeout(() => this.studentAlert = false, 3000);
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.getStudents());
  }

  deleteStudent(id: number){
    return new Promise((resolve, reject) => {
      this.usersService.deleteInfo(id).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.studentAlert = true;
            this.alertType = 'success';
            this.studentMessage = 'User information successfully deleted.';
            setTimeout(() => this.studentAlert = false, 3000);
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.getStudents());
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

  clearEntry(){
    this.studentSettings = {
      id_students: null,
      password: null,
      first_name: null,
      last_name: null,
      status: 'true',
      phone_number: null,
      email: null,
      requested_books: null
    }
  }

  enableEdit(){
    this.edit = !this.edit;
    this.edit ? this.enableMessage = 'Disable Edit' : this.enableMessage = 'Enable Edit'
  }

  retrieveFees(id: number){
    this.feeService.retrieveFees(id).subscribe({
      next: data => {
        if(data.length === 0) {
          this.feeStatus = true;
          this.alertType = 'success';
          this.feeMessage = 'You do not have any fee information';
        }
        else if (data.length > 0) {
          let realFee = false;
          for (let element of data) {
            if (+element.fee_amount > 0) {
              realFee = true;
            }
          }
          if (realFee) {
            this.fee = true;
            this.feeArray = [];
            this.pendingFeeArray = [];
            this.dueAmount = 0;
            this.pendingFee = false;
            for (let element of data) {
              if (+element.fee_amount > 0 && element.payed_day !== null){
                this.feeArray.push(element);
              }
              if (element.payed_day === null){
                this.pendingFeeArray.push(element);
                this.dueAmount += +element.fee_amount;
                this.pendingFee = true;
              }
            }
            this.feeArray = this.feeArray.sort((a, b) => (a.payed_day > b.payed_day) ? -1 : (b.payed_day > a.payed_day) ? 1 : 0);
            for (let element of this.pendingFeeArray){
              this.feeArray.unshift(element);
            }
          }
          else {
            this.feeStatus = true;
            this.alertType = 'success';
            this.feeMessage = 'You do not have any fee information';
          }
        }
      },
      error: err => console.log(err)
    })
  }

  payNow(feeInfo){
    this.payOb.id_loan = +feeInfo.id_loans;
    this.payOb.id_students = +feeInfo.id_students;
    const return_date = new Date();
    this.payOb.returned_date = `${return_date.getFullYear()}-${return_date.getMonth()+1}-${return_date.getDate()}`;
    return new Promise((resolve, reject) => {
      this.feeService.payNow(this.payOb).subscribe({
        next: data => {
          if (data.result === '404') {
            this.paymentAlert = true;
            setTimeout(() => this.paymentAlert = false, 6000);
            this.paymentMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.paymentAlert = true;
            setTimeout(() =>  this.paymentAlert = false, 3000);
            this.paymentMessage = data.message;
            this.alertType = 'success';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrieveFees(this.payOb.id_students));
  }

  payAll(feeInfo){
    this.payObAll.id_students = +feeInfo.id_students;
    const return_date = new Date();
    this.payObAll.today = `${return_date.getFullYear()}-${return_date.getMonth()+1}-${return_date.getDate()}`;
    return new Promise((resolve, reject) => {
      this.feeService.payAll(this.payObAll).subscribe({
        next: data => {
          if (data.result === '404') {
            this.paymentAlert = true;
            setTimeout(() => this.paymentAlert = false, 6000);
            this.paymentMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.paymentAlert = true;
            setTimeout(() =>  this.paymentAlert = false, 3000);
            this.paymentMessage = data.message;
            this.alertType = 'success';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrieveFees(this.payObAll.id_students));
  }

}

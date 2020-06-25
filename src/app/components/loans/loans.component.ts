import { Component, OnInit } from '@angular/core';
import { Loan, IDeliverLoans, IReturnBookLoan, IPayment } from 'src/app/modal/modal';
import { LoanService } from 'src/app/services/loan.service';
import { BooksService } from 'src/app/services/books.service';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {

  page = 1;
  pageSize = 4;
  collectionSizeReturn: number;
  collectionSizeDeliver: number;
  collectionSizeDelay: number;
  deliver: boolean = true;
  return: boolean = false;
  delay: boolean = false;

  get delivers(): Loan[] {
    return this.deliverArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  get returns(): Loan[] {
    return this.returnArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  get delays(): Loan[] {
    return this.delayArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  originalDeliver: Loan[] = [];
  deliverArray: Loan[] = [];
  originalReturn: Loan[] = [];
  returnArray: Loan[] = [];
  originalDelay: Loan[] = [];
  delayArray: Loan[] = [];
  requestResult: Loan[] = [];
  tableTitles: string[] = ['Order Date', 'User', 'Email', 'Title', 'Author', 'ISBN', 'Deliver'];
  loanAlert: boolean = false;
  loanMessage: string;
  alertType: string;
  paymentAlert: boolean = false;
  paymentMessage: string;
  activeDelay: boolean = false;
  activeDeliver: boolean = false;
  activeReturn: boolean = false;

  private _searchOptionInfo: string;

  searchOptionCategory: string = 'orderDate';

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.deliverArray = this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory, this.originalDeliver) : this.originalDeliver;
    this.returnArray = this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory, this.originalReturn) : this.originalReturn;
    this.delayArray = this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory, this.originalDelay) : this.originalDelay;
    this.activeDeliver = this.deliverArray.length > 0 ? true : false;
    this.activeReturn = this.returnArray.length > 0 ? true : false;
    this.activeDelay = this.delayArray.length > 0 ? true : false;
    this.collectionSizeDeliver = this.deliverArray.length;
    this.collectionSizeReturn = this.returnArray.length;
    this.collectionSizeDelay = this.delayArray.length;
  }

  selectedElement: Loan = {
    out_date: null,
    due_date: null,
    id_isbn: null,
    returned_day: null,
    order_date: null,
    title: null,
    id_students: null,
    first_name: null,
    last_name: null,
    email: null,
    first_name_author: null,
    last_name_author: null
  }

  deliverObj: IDeliverLoans = {
    id_isbn: null,
    id_students: null,
    today: null,
    authorized_admin: null,
    due_date: null
  }

  returnedInfo: IReturnBookLoan = {
    id_isbn: null,
    id_students: null,
    returned_date: null
  }

  fee: boolean = false;
  feeAmount: number;
  id_loan: number;


  payOb: IPayment = {
    id_students: null,
    id_loan: null,
    returned_date: null
  }

  constructor(private loanService: LoanService, private booksService: BooksService, private feeService: FeeService) { }

  ngOnInit(): void {
    this.getLoans();
  }

  getLoans(){
    this.loanService.getLoans().subscribe({
      next: data => {
        this.requestResult = data.sort((a, b) => (a.order_date > b.order_date) ? 1 : (b.order_date > a.order_date) ? -1 : 0);
        const today = new Date();
        for (let element of this.requestResult){
          if(element.out_date === null && element.due_date === null && element.returned_day === null){
            this.deliverArray.push(element);
          }
          if(element.order_date !== null && element.out_date !== null && element.returned_day === null){
            const dueDateArr: any[] = element.due_date.split('-');
            let due_date = new Date(dueDateArr[0], dueDateArr[1]-1, dueDateArr[2]);
            if (due_date >= today) {
              this.returnArray.push(element);
            }
            else {
              this.delayArray.push(element);
            }
          }
        }
        this.activeDeliver = this.deliverArray.length > 0 ? true : false;
        this.activeReturn = this.returnArray.length > 0 ? true : false;
        this.activeDelay = this.delayArray.length > 0 ? true : false;
        this.originalDeliver = [...this.deliverArray];
        this.originalReturn = [...this.returnArray];
        this.originalDelay = [...this.delayArray];
        this.collectionSizeDeliver = this.originalDeliver.length;
      },
      error: err => console.log(err)
    })
  }

  performFilter(searchBy: string, category: string, array: Loan[]) {

    searchBy = searchBy.toLocaleLowerCase();

    switch(category){
      case 'orderDate':
        return array.filter(element =>
          element.order_date.toString().indexOf(searchBy) !== -1
        );
      case 'outDate':
        return array.filter(element =>
          element.out_date.toString().indexOf(searchBy) !== -1
        );
      case 'dueDate':
        return array.filter(element =>
          element.due_date.toString().indexOf(searchBy) !== -1
        );
      case 'user':
        return array.filter(element => {
          let fullName = element.first_name + element.last_name;
          return fullName.toLowerCase().indexOf(searchBy) !== -1;
        })
      case 'email':
        return array.filter(element =>
          element.email.toLowerCase().indexOf(searchBy) !== -1
        )
      case 'title':
        return array.filter(element =>
          element.title.toLowerCase().indexOf(searchBy) !== -1
        )
      case 'author':
        return array.filter(element => {
          let fullName = element.first_name_author + element.last_name_author;
          return fullName.toLowerCase().indexOf(searchBy) !== -1
        })
      case 'isbn':
        return array.filter(element =>
          element.id_isbn.toString().indexOf(searchBy) !== -1
        );
    }
  }

  changeDeliver(){
    this.deliver = true;
    this.return = false;
    this.delay = false;
    this.tableTitles = ['Order Date', 'User', 'Email', 'Title', 'Author', 'ISBN', 'Deliver'];
    this.collectionSizeDeliver = this.deliverArray.length;
  }

  changeReturn(){
    this.deliver = false;
    this.return = true;
    this.delay = false;
    this.tableTitles =  ['Order Date', 'Out Date', 'Due Date', 'User', 'Email', 'Title', 'Author', 'ISBN', 'Return'];
    this.collectionSizeReturn = this.returnArray.length;
  }

  changeDelay(){
    this.deliver = false;
    this.return = false;
    this.delay = true;
    this.tableTitles =  ['Order Date', 'Out Date', 'Due Date', 'User', 'Email', 'Title', 'Author', 'ISBN', 'Return'];
    this.collectionSizeDelay = this.delayArray.length;
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

  selectedInfo(info: Loan){
    this.selectedElement = info;
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  deliverBook(){
    this.deliverObj.id_isbn = +this.selectedElement.id_isbn;
    this.deliverObj.id_students = +this.selectedElement.id_students;
    const userId = localStorage.getItem('userId');
    this.deliverObj.authorized_admin = +userId;
    const today = new Date();
    this.deliverObj.today = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    const out_date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due_date = this.addDays(out_date, 7);
    this.deliverObj.due_date = `${due_date.getFullYear()}-${due_date.getMonth()+1}-${due_date.getDate()}`;

    return new Promise((resolve, reject) => {
      this.booksService.deliverBook(this.deliverObj).subscribe({
        next: data => {
          if (data.result === '404') {
            this.loanAlert = true;
            setTimeout(() => this.loanAlert = false, 4000);
            this.loanMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.loanAlert = true;
            setTimeout(() =>  this.loanAlert = false, 4000);
            this.loanMessage = data.message;
            this.alertType = 'success';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => {
        this.deliverArray = [];
        this.returnArray = [];
        this.delayArray = [];
        this.requestResult = [];
        this.getLoans();
      })

  }

  returnBook(){
    const return_date = new Date();
    this.returnedInfo.returned_date = `${return_date.getFullYear()}-${return_date.getMonth()+1}-${return_date.getDate()}`;
    this.returnedInfo.id_students = +this.selectedElement.id_students;
    this.returnedInfo.id_isbn = +this.selectedElement.id_isbn;

    return new Promise((resolve, reject) => {
      this.booksService.returnBook(this.returnedInfo).subscribe({
        next: data => {
          if (data.result === '404') {
            this.loanAlert = true;
            setTimeout(() => this.loanAlert = false, 3000);
            this.loanMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.loanAlert = true;
            setTimeout(() => this.loanAlert = false, 3000);
            this.loanMessage = data.message;
            this.alertType = 'success';
            if (data.fee !== 0){
              this.fee = true;
              this.feeAmount = data.fee;
              this.id_loan = data.idLoan;
            }
          }
          resolve(true);
        },
        error: err => {console.log(err), resolve(false)}
      })
    }).then(() => {
      this.deliverArray = [];
      this.returnArray = [];
      this.delayArray = [];
      this.requestResult = [];
      this.getLoans();
    });
  }

  payNow(){
    this.payOb.id_loan = +this.id_loan;
    this.payOb.id_students = +this.selectedElement.id_students;
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
            setTimeout(() => this.fee = false, 3000);
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.id_loan = null)
  }

}

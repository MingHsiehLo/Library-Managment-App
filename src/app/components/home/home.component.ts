import { Component, OnInit } from '@angular/core';
import { ILoan, Fee } from 'src/app/modal/modal';
import { AuthService } from 'src/app/services/auth.service';
import { LoanService } from 'src/app/services/loan.service';
import { UsersService } from 'src/app/services/users.service';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userAdmin: boolean;
  status: string = 'OK.';
  checkedItems: number = 0;
  holdedItems: number = 0;
  dueItems: number = 0;
  totalDue: number = 0;
  requestResult: any[] = [];
  loansArray: ILoan[] = [];
  feeArrayOriginal: Fee[] = [];
  lastPaymentDay: string;

  constructor(private authService: AuthService, private loanService: LoanService, private usersService: UsersService,
    private feeService: FeeService) { }

  ngOnInit(): void {
    this.requestResult = [];
    this.loansArray = [];
    this.feeArrayOriginal = [];
    const userId = +localStorage.getItem('userId');
    const userStatus = +localStorage.getItem('status');
    this.userAdmin = this.authService.retrieveUserType();
    Promise.all([this.getLoans(), this.retrieveFees(userId)]).then(() => {
      if (userStatus !== 0){
        this.status = this.totalDue > 0 ? 'Pending Debt.' : 'OK.';
        if (this.lastPaymentDay !== null){
          const lastPaymentArr: any[] = this.lastPaymentDay.split('-');
          const lastDate: Date = new Date(lastPaymentArr[0], lastPaymentArr[1]-1, lastPaymentArr[2]);
          const today = new Date();
          const diffDates = this.dateDiffInDays(lastDate, today);
          if (this.lastPaymentDay !== null && diffDates < 7 && diffDates >= 0){
            if (this.totalDue > 0) {
              this.status = `Pending Debt.`;
            }
            else {
              this.status = `Debt Penalty. ${7 - diffDates} days remaining.`;
            }
          }
        }
      }
      else {
        this.status = 'Not Active.'
      }
    })

  }

  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


  getLoans(){
    return new Promise((resolve, reject) => {
      this.loanService.getLoans().subscribe({
        next: data => {
          this.requestResult = data.sort((a, b) => (a.order_date > b.order_date) ? -1 : (b.order_date > a.order_date) ? 1 : 0);
          const userId = +localStorage.getItem('userId');
          for (let element of this.requestResult){
            if(+element.id_students === userId){
              this.loansArray.push(element);
            }
          }
          for (let element of this.loansArray) {
            if (element.out_date === null && element.returned_day === null){
              this.holdedItems++;
            }
            if (element.out_date !== null && element.returned_day === null){
              this.checkedItems++;
            }
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    })
  }


  retrieveFees(id: number){
    return new Promise((resolve, reject) => {
      this.feeService.retrieveFees(id).subscribe({
        next: data => {
          this.feeArrayOriginal = data.sort((a, b) => (a.returned_day > b.returned_day) ? -1 : (b.returned_day > a.returned_day) ? 1 : 0);
          let payedDateArr: Fee[] = data.sort((a, b) => (a.payed_day > b.payed_day) ? -1 : (b.payed_day > a.payed_day) ? 1 : 0);
          if (payedDateArr[0] === undefined || payedDateArr[0] === null){
            this.lastPaymentDay = null;
          }
          else {
            this.lastPaymentDay = payedDateArr[0].payed_day;
          }
          for (let element of this.feeArrayOriginal){
            if (element.fee_amount > 0 && element.payed_day === null) {
              this.totalDue += +element.fee_amount;
              this.dueItems++;
            }
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    })
  }

}

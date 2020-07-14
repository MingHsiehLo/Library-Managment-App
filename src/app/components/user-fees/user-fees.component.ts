import { Component, OnInit } from '@angular/core';
import { Fee, IPaymentAll } from 'src/app/modal/modal';
import { UsersService } from 'src/app/services/users.service';
import { FeeService } from 'src/app/services/fee.service';

@Component({
  selector: 'app-user-fees',
  templateUrl: './user-fees.component.html',
  styleUrls: ['./user-fees.component.css']
})

export class UserFeesComponent implements OnInit {

  page = 1;
  pageSize = 6;
  collectionSize: number;

  get fees(): Fee[] {
    return this.feeArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  private _searchOptionInfo: string;

  searchOptionCategory = 'returnedDate';

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.feeArray =
      this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory) : this.feeArrayOriginal;
    this.collectionSize = this.feeArray.length;
  }

  fee = false;
  feeArray: Fee[] = [];
  feeArrayOriginal: Fee[] = [];
  payedArr: Fee[] = [];
  tableTitles: string[] = ['Returned Date', 'Title', 'Author', 'Fee Amount', 'Payed Date'];
  paymentAlert = false;
  paymentMessage: any;
  alertType: string;
  dueItems = 0;
  totalDue = 0;
  payOb: IPaymentAll = {
    id_students: null,
    today: null
  };
  activeFee = false;
  feeArrayBackEnd: Fee[] = [];

  constructor(private usersService: UsersService, private feeService: FeeService) { }

  ngOnInit(): void {
    const userId = +localStorage.getItem('userId');
    this.retrieveFees(userId);
  }

  retrieveFees(id: number){
    this.feeService.retrieveFees(id).subscribe({
      next: data => {
        if (data.length <= 0) {
          this.activeFee = false;
        }
        else if (data.length > 0){
          this.feeArrayBackEnd = [];
          this.feeArrayOriginal = [];
          this.activeFee = true;
          this.feeArrayBackEnd = data.sort((a, b) => (a.returned_day > b.returned_day) ? -1 : (b.returned_day > a.returned_day) ? 1 : 0);
          for (const element of this.feeArrayBackEnd) {
            if (+element.fee_amount !== 0){
              this.feeArrayOriginal.push(element);
            }
          }
          this.feeArray = [...this.feeArrayOriginal];
          for (const element of this.feeArrayOriginal){
            if (+element.fee_amount > 0 && element.payed_day === null) {
              this.totalDue += +element.fee_amount;
              this.dueItems++;
            }
            if (element.payed_day !== null) {
              this.payedArr.push(element);
            }
          }
          this.totalDue > 0 ? this.fee = true : this.fee = false;
          this.collectionSize = this.feeArrayOriginal.length;
        }
      },
      error: err => console.log(err)
    });
  }

  performFilter(searchBy: string, category: string) {

    searchBy = searchBy.toLowerCase();

    switch (category){
      case 'returnedDate':
        return this.feeArrayOriginal.filter(element =>
          element.returned_day.toString().indexOf(searchBy) !== -1
        );
      case 'title':
        return this.feeArrayOriginal.filter(element =>
          element.title.toLowerCase().indexOf(searchBy) !== -1
        );
      case 'author':
        return this.feeArrayOriginal.filter(element => {
          const fullName = element.authorFirst + element.authorLast;
          return fullName.toLowerCase().indexOf(searchBy) !== -1;
        });
      case 'feeAmount':
        return this.feeArrayOriginal.filter(element =>
          element.fee_amount.toString().indexOf(searchBy) !== -1
        );
      case 'payedDate':
        return this.payedArr.filter(element =>
          element.payed_day.toString().indexOf(searchBy) !== -1
        );
    }
  }

  payNow(){
    const userId = +localStorage.getItem('userId');
    this.payOb.id_students = userId;
    const return_date = new Date();
    this.payOb.today = `${return_date.getFullYear()}-${return_date.getMonth() + 1}-${return_date.getDate()}`;
    return new Promise((resolve, reject) => {
      this.feeService.payAll(this.payOb).subscribe({
        next: data => {
          if (data.result === '404') {
            this.paymentAlert = true;
            setTimeout(() => this.paymentAlert = false, 4000);
            this.paymentMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.paymentAlert = true;
            setTimeout(() =>  this.paymentAlert = false, 4000);
            this.paymentMessage = data.message;
            this.alertType = 'success';
            this.totalDue = 0;
            this.dueItems = 0;
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.retrieveFees(userId));
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

}

import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { Loan } from 'src/app/modal/modal';

@Component({
  selector: 'app-user-loans',
  templateUrl: './user-loans.component.html',
  styleUrls: ['./user-loans.component.css']
})
export class UserLoansComponent implements OnInit {

  page = 1;
  pageSize = 6;
  collectionSize: number;

  get loans(): Loan[] {
    return this.loansArray
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  loan: Loan[] = [];
  loansArray: Loan[] = [];
  requestResult: Loan[] = [];
  tableTitles: string[] = ['Order Date', 'Out Date', 'Due Date', 'Returned Date', 'Title', 'Author', 'ISBN'];

  private _searchOptionInfo: string;

  searchOptionCategory: string = 'orderDate';

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.loansArray = this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory) : this.loan;
    this.collectionSize = this.loansArray.length;
  }

  checkedItems: number = 0;
  holdedItems: number = 0;
  activeLoan: boolean = false;
  pendingOutLoan: Loan[] = [];
  pendingReturnLoan: Loan[] = [];

  constructor(private loanService: LoanService) { }

  ngOnInit(): void {
    this.getLoans();
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
          this.activeLoan = this.loansArray.length > 0 ? true : false ;
          for (let element of this.loansArray) {
            if (element.out_date === null && element.returned_day === null){
              this.holdedItems++;
            }
            if (element.out_date !== null && element.returned_day === null){
              this.checkedItems++;
            }
          }
          for (let element of this.loansArray){
            if (element.out_date !== null) {
              this.pendingOutLoan.push(element);
            }
            if (element.returned_day !== null){
              this.pendingReturnLoan.push(element);
            }
          }
          this.loan = [...this.loansArray];
          this.collectionSize = this.loan.length;
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    })
  }

  performFilter(searchBy: string, category: string) {

    // (category === 'user' || category === 'email' || category === 'title' || category === 'author') ?
    // (searchBy = searchBy.toLowerCase()) : (searchBy);
    searchBy = searchBy.toLocaleLowerCase();

    switch(category){
      case 'orderDate':
        return this.loan.filter(element =>
          element.order_date.toString().indexOf(searchBy) !== -1
        );
      case 'outDate':
        return this.pendingOutLoan.filter(element =>
          element.out_date.toString().indexOf(searchBy) !== -1
        );
      case 'dueDate':
        return this.pendingOutLoan.filter(element =>
          element.due_date.toString().indexOf(searchBy) !== -1
        );
      case 'returnedDate':
        return this.pendingReturnLoan.filter(element =>
          element.returned_day.toString().indexOf(searchBy) !== -1
        );
      case 'title':
        return this.loan.filter(element =>
          element.title.toLowerCase().indexOf(searchBy) !== -1
        )
      case 'author':
        return this.loan.filter(element => {
          let fullName = element.first_name_author + element.last_name_author;
          return fullName.toLowerCase().indexOf(searchBy) !== -1
        })
      case 'isbn':
        return this.loan.filter(element =>
          element.id_isbn.toString().indexOf(searchBy) !== -1
        );
    }
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

}

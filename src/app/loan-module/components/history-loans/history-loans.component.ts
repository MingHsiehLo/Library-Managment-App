import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { Loan } from 'src/app/shared/modal';

@Component({
  selector: 'app-history-loans',
  templateUrl: './history-loans.component.html',
  styleUrls: ['./history-loans.component.css']
})
export class HistoryLoansComponent implements OnInit {

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
  tableTitles: string[] = ['Order Date', 'Out Date', 'Returned Date', 'User', 'Email', 'Title', 'Author', 'ISBN'];
  loanHistory = true;

  private _searchOptionInfo: string;

  searchOptionCategory = 'orderDate';

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.loansArray =
      this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory) : this.loan;
    this.loanHistory = this.loansArray.length > 0 ? false : true;
    this.collectionSize = this.loansArray.length;
  }

  constructor(private loanService: LoanService) { }

  ngOnInit(): void {
    this.getLoans();
  }

  getLoans(){
    this.loanService.getLoans().subscribe({
      next: data => {
        this.requestResult = data.sort((a, b) => (a.order_date > b.order_date) ? -1 : (b.order_date > a.order_date) ? 1 : 0);
        for (const element of this.requestResult){
          if (element.returned_day !== null){
            this.loansArray.push(element);
          }
        }
        this.loan = [...this.loansArray];
        this.collectionSize = this.loan.length;
        this.loanHistory = this.loansArray.length > 0 ? false : true;
      },
      error: err => console.log(err)
    });
  }

  performFilter(searchBy: string, category: string) {

    searchBy = searchBy.toLocaleLowerCase();

    switch (category){
      case 'orderDate':
        return this.loan.filter(element =>
          element.order_date.toString().indexOf(searchBy) !== -1
        );
      case 'outDate':
        return this.loan.filter(element =>
          element.out_date.toString().indexOf(searchBy) !== -1
        );
      case 'returnedDate':
        return this.loan.filter(element =>
          element.returned_day.toString().indexOf(searchBy) !== -1
        );
      case 'user':
        return this.loan.filter(element => {
          const fullName = element.first_name + element.last_name;
          return fullName.toLowerCase().indexOf(searchBy) !== -1;
        });
      case 'email':
        return this.loan.filter(element =>
          element.email.toLowerCase().indexOf(searchBy) !== -1
        );
      case 'title':
        return this.loan.filter(element =>
          element.title.toLowerCase().indexOf(searchBy) !== -1
        );
      case 'author':
        return this.loan.filter(element => {
          const fullName = element.first_name_author + element.last_name_author;
          return fullName.toLowerCase().indexOf(searchBy) !== -1;
        });
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

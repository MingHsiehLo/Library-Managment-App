export interface IStudent {
  requested_books: any;
  id_students: number,
  password: string,
  first_name: string,
  last_name: string,
  status: string,
  phone_number: string,
  email: string
}

export class Fee {
  constructor(
    public id_fees: number,
    public id_loans: number,
    public fee_amount: number,
    public payed_day: string,
    public id_students: number,
    public returned_day: string,
    public title: string,
    public authorFirst: string,
    public authorLast: string
  ){}
}

export class Student {
  requested_books: number;
  constructor(
    public id_students: number,
    public password: string,
    public first_name: string,
    public last_name: string,
    public status: string,
    public phone_number: string,
    public email: string,
    requested_books?: number
  ){
    this.requested_books = +requested_books;
  }

  _fullName: string;

  get fullName(){
    return `${this.first_name} ${this.last_name}`;
  }

  set fullName(fullName){
    const names = fullName.split(' ');
    this.first_name = names[0];
    this.last_name = names[1];
  }
}

export interface ILoan {
  out_date: string;
  due_date: string;
  id_isbn: number;
  returned_day: string;
  order_date: string;
  title: string;
  id_students: number;
  first_name: string;
  last_name: string;
  email: string;
  first_name_author: string;
  last_name_author: string;
}

export class Featured {
  constructor(
    public title: string,
    public author: string,
    public img: string,
    public alt: string,
    public isbn: string,
    public description?: string
  ){}
}

export class Loan implements ILoan {
  constructor(
    public out_date: string,
    public due_date: string,
    public id_isbn: number,
    public returned_day: string,
    public order_date: string,
    public title: string,
    public id_students: number,
    public first_name: string,
    public last_name: string,
    public email: string,
    public first_name_author: string,
    public last_name_author: string
  ){}
}

export interface IStudent {
  requested_books: any;
  id_students: number;
  password: string;
  first_name: string;
  last_name: string;
  status: string;
  phone_number: string;
  email: string;
  type?: string;
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
  type: string;
  constructor(
    public id_students: number,
    public password: string,
    public first_name: string,
    public last_name: string,
    public status: string,
    public phone_number: string,
    public email: string,
    type?: string,
    requested_books?: number
  ){
    this.type = type;
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

export interface IDeliverLoans {
  id_students: number;
  id_isbn: number;
  today: string;
  authorized_admin: number;
  due_date: string;
}

export interface IReturnBookLoan {
  id_students: number;
  id_isbn: number;
  returned_date: string;
}

export interface IExportingBook {
  id_isbn: number;
  title: string;
  availability: string;
  copy_number: number;
  dewey_code: number;
  id_author: number;
  id_genre: number;
  id_publisher: number;
}

export interface IPayment {
  id_loan: number;
  id_students: number;
  returned_date: string;
}

export interface IPaymentAll {
  id_students: number;
  today: string;
}

export interface IRequest {
  id_students: number;
  id_isbn: number;
  out_date: string;
  due_date: string;
  authorized_admin: number;
}

export interface IRequestUser {
  id_students: number;
  id_isbn: number;
  order_date: string;
  payment_date_check: string;
  authorized_admin: number;
}

export interface IReturn {
  id_students: number;
  id_isbn: number;
  returned_date: string;
  authorized_admin: number;
}

export interface IPostingBook {
  id_isbn: number;
  title: string;
  availability: string;
  copy_number: number;
  dewey_code: number;
  author: string;
  publisher: string;
  genre: string;
}

export interface IEditingBook {
  id_isbn: number;
  title: string;
  availability: string;
  copy_number: number;
  dewey_code: number;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  publisher: number;
  genre: number;
}

export class Book {
  requested_times: number;
  constructor(
    public id_isbn: number,
    public title: string,
    public availability: string,
    public copy_number: number,
    public dewey_code: number,
    requested_times: number,
    public authorFirstName: string,
    public authorLastName: string,
    public publisher: string,
    public genre: string
  ){
    this.requested_times = +requested_times;
  }
}

export class Author {
  constructor(
    public id_author: number,
    public firstName: string,
    public lastName: string
  ){}
}

export class Genre {
  constructor(
    public id_genre: number,
    public description_genre: string,
  ){}
}

export class Publisher {
  constructor(
    public id_publisher: number,
    public description_publisher: string,
  ){}
}

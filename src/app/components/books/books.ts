import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface IExportingBook {
  id_isbn: number,
  title: string,
  availability: string,
  copy_number: number,
  dewey_code: number,
  id_author: number,
  id_genre: number,
  id_publisher: number
}

export interface IPayment {
  id_loan: number,
  id_students: number,
  returned_date: string
}

export interface IPaymentAll {
  id_students: number,
  today: string
}

export interface IRequest {
  id_students: number,
  id_isbn: number,
  out_date: string,
  due_date: string,
  authorized_admin: number
}

export interface IRequestUser {
  id_students: number,
  id_isbn: number,
  order_date: string,
  payment_date_check: string,
  authorized_admin: number
}

export interface IReturn {
  id_students: number,
  id_isbn: number,
  returned_date: string,
  authorized_admin: number
}

export interface IPostingBook {
  id_isbn: number,
  title: string,
  availability: string,
  copy_number: number,
  dewey_code: number,
  author: string,
  publisher: string,
  genre: string
}

export interface IEditingBook {
  id_isbn: number,
  title: string,
  availability: string,
  copy_number: number,
  dewey_code: number,
  author: string,
  authorFirstName: string,
  authorLastName: string,
  publisher: number,
  genre: number
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

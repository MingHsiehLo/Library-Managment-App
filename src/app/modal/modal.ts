export interface ILoan {
  out_date: string,
  due_date: string,
  id_isbn: number,
  returned_day: string,
  order_date: string,
  title: string,
  id_students: number,
  first_name: string,
  last_name: string,
  email: string,
  first_name_author: string,
  last_name_author: string
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


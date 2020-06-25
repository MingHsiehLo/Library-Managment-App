export interface IDeliverLoans {
  id_students: number,
  id_isbn: number,
  today: string,
  authorized_admin: number,
  due_date: string
}

export interface IReturnBookLoan {
  id_students: number,
  id_isbn: number,
  returned_date: string,
}

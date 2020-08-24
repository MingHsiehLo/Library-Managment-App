import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Loan } from '../shared/modal';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(private http: HttpClient) { }

  getLoans(): Observable<Loan[]>{
    return this.http.get('https://thefoundationlibrary.000webhostapp.com/foundation-api/loan/getLoans.php').pipe(
      map((res: any) => {
        return res.map(element => {
          return new Loan(
            element.out_date,
            element.due_date,
            element.id_isbn,
            element.returned_day,
            element.order_date,
            element.title,
            element.id_students,
            element.first_name,
            element.last_name,
            element.email,
            element.first_name_author,
            element.last_name_author
          );
        });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}

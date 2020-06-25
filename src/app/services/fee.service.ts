import { Injectable } from '@angular/core';
import { IPaymentAll, IPayment, Fee } from '../modal/modal';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class FeeService {

  constructor(private http: HttpClient){}

  retrieveFees(studentId: number): Observable<any> {
    const id = studentId;
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/loan/retrieveFees.php?id=${id}`).pipe(
      map((res: any) => {
        return res.map(element => {
          return new Fee(
            element.id_fees,
            element.id_loans,
            element.fee_amount,
            element.payed_day,
            element.id_students,
            element.returned_day,
            element.title,
            element.first_name_author,
            element.last_name_author
          )
        })
      }),
      catchError(this.handleError)
    );
  }

  payNow(payOb: IPayment): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/loan/payNow.php', JSON.stringify(payOb)).pipe(
      catchError(this.handleError)
    )
  }

  payAll(payOb: IPaymentAll): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/loan/payAll.php', JSON.stringify(payOb)).pipe(
      catchError(this.handleError)
    )
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
  };

}

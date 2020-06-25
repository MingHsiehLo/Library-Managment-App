import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book, IExportingBook, IRequest, IReturn, IPayment, IRequestUser, IReturnBookLoan } from '../modal/modal';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Book[]>{

    let headers: HttpHeaders = new HttpHeaders;

    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.http.get<Book[]>('http://softwood-plastics.000webhostapp.com/api/library-php/getBooks.php', {headers: headers}).pipe(
      map((res: any) => {
        return res.map(element => {
          let booleanAvailability: string = element.availability === '1' ? 'true' : 'false';
          return new Book(
            element.id_isbn,
            element.title,
            booleanAvailability,
            element.copy_number,
            element.dewey_code,
            element.requested_times,
            element.first_name_author,
            element.last_name_author,
            element.description_publisher,
            element.description_genre
          )
        })
      }),
      catchError(this.handleError)
    );
  }

  postInfo(bookInfo: IExportingBook): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/postBooks.php', JSON.stringify(bookInfo)).pipe(
      catchError(this.handleError)
    );
  }

  updateInfo(bookInfo: IExportingBook): Observable<any> {
    bookInfo.dewey_code = null;
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/modifyBook.php', JSON.stringify(bookInfo)).pipe(
      catchError(this.handleError)
    );
  }

  deleteInfo(isbn: number): Observable<any> {
    const id = isbn;
    return this.http.get(`http://softwood-plastics.000webhostapp.com/api/library-php/deleteBook.php?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  requestBook(requestInfo: IRequest): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/service/postloan.php', JSON.stringify(requestInfo)).pipe(
      catchError(this.handleError)
    )
  }

  requestUserBook(requestInfo: IRequestUser): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/service/requestBookUser.php', JSON.stringify(requestInfo)).pipe(
      catchError(this.handleError)
    )
  }

  returnBook(requestInfo: IReturn | IReturnBookLoan): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/service/returnBook.php', JSON.stringify(requestInfo)).pipe(
      catchError(this.handleError)
    )
  }

  payNow(payOb: IPayment): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/service/payNow.php', JSON.stringify(payOb)).pipe(
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book, IExportingBook, IRequest, IReturn, IRequestUser, IReturnBookLoan, IDeliverLoans, Featured } from '../modal/modal';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getFeatured(): Observable<Featured[]> {
    return this.http.get('https://thefoundationlibrary.000webhostapp.com/foundation-api/book/getFeatured.php').pipe(
      map((res: any) => {
        return res.map(element => {
          return new Featured(
            element.title,
            element.author,
            element.img,
            element.alt,
            element.isbn,
            element.description
          );
        });
      }),
      catchError(this.handleError)
    );
  }

  getInfo(): Observable<Book[]>{

    const headers: HttpHeaders = new HttpHeaders();

    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.http.get<Book[]>(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/getBooks.php',
      { headers }
    ).pipe(
        map((res: any) => {
          return res.map(element => {
            const booleanAvailability: string = element.availability === '1' ? 'true' : 'false';
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
            );
          });
        }),
      catchError(this.handleError)
    );
  }

  postInfo(bookInfo: IExportingBook): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/postBooks.php',
      JSON.stringify(bookInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateInfo(bookInfo: IExportingBook): Observable<any> {
    bookInfo.dewey_code = null;
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/modifyBook.php',
      JSON.stringify(bookInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteInfo(isbn: number): Observable<any> {
    const id = isbn;
    return this.http.post(`https://thefoundationlibrary.000webhostapp.com/foundation-api/book/deleteBook.php?id=${id}`, null).pipe(
      catchError(this.handleError)
    );
  }

  requestBook(requestInfo: IRequest): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/loan/postLoan.php',
      JSON.stringify(requestInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  requestUserBook(requestInfo: IRequestUser): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/requestBookUser.php',
      JSON.stringify(requestInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  returnBook(requestInfo: IReturn | IReturnBookLoan): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/returnBook.php',
      JSON.stringify(requestInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  deliverBook(deliverInfo: IDeliverLoans): Observable<any>{
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/book/deliverBook.php',
      JSON.stringify(deliverInfo)
    ).pipe(
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

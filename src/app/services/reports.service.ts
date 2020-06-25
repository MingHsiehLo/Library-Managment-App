import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '../modal/modal';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Book[]>{

    let headers: HttpHeaders = new HttpHeaders;

    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.http.get<Book[]>('https://thefoundationlibrary.000webhostapp.com/foundation-api/book/getBooks.php', {headers: headers}).pipe(
      map((res: any) => {
        return res.map(element => {
          let booleanAvailability: string = element.availability === '1' ? 'true' : 'false';
          return new Book(
            element.id_isbn,
            element.title,
            booleanAvailability,
            element.copy_number,
            element.dewey_code,
            +element.requested_times,
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

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Author } from '../modal/modal';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http: HttpClient) { }

  retrieveAuthors(location: string): Observable<Author[]> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/retrieveInfo.php?location=${location}`).pipe(
      map((res: any)=>{
        return res.map((element) => {
          return new Author(
            element.id_author,
            element.first_name_author,
            element.last_name_author
          )
        })
      }),
      catchError(this.handleError)
    )
  }

  postAuthor(authorInfo: Author): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/author/postAuthor.php', JSON.stringify(authorInfo)).pipe(
      catchError(this.handleError)
    )
  }

  modifyAuthor(authorInfo: Author): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/author/modifyAuthor.php', JSON.stringify(authorInfo)).pipe(
      catchError(this.handleError)
    )
  }

  deleteAuthor(id: number): Observable<any> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/author/deleteAuthor.php?id=${id}`).pipe(
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

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Genre } from '../modal/modal';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private http: HttpClient) { }

  retrieveGenre(location: string): Observable<Genre[]> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/retrieveInfo.php?location=${location}`).pipe(
      map((res: any) => {
        return res.map((element) => {
          return new Genre(
            element.id_genre,
            element.description_genre
          );
        });
      }),
      catchError(this.handleError)
    )
  }

  postGenre(genreInfo: Genre): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/genre/postGenre.php',
      JSON.stringify(genreInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  modifyGenre(genreInfo: Genre): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/genre/modifyGenre.php',
      JSON.stringify(genreInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/genre/deleteGenre.php?id=${id}`).pipe(
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

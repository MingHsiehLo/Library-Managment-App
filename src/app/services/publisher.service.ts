import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Publisher } from '../modal/modal';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http: HttpClient) { }

  retrievePublisher(location: string): Observable<Publisher[]> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/retrieveInfo.php?location=${location}`).pipe(
      map((res: any)=>{
        return res.map((element) => {
          return new Publisher(
            element.id_publisher,
            element.description_publisher
          )
        })
      }),
      catchError(this.handleError)
    )
  }

  postPublisher(publisherInfo: Publisher): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/publisher/postPublisher.php', JSON.stringify(publisherInfo)).pipe(
      catchError(this.handleError)
    )
  }

  modifyPublisher(publisherInfo: Publisher): Observable<any> {
    return this.http.post('https://thefoundationlibrary.000webhostapp.com/foundation-api/publisher/modifyPublisher.php', JSON.stringify(publisherInfo)).pipe(
      catchError(this.handleError)
    )
  }

  deletePublisher(id: number): Observable<any> {
    return this.http.get(`https://thefoundationlibrary.000webhostapp.com/foundation-api/publisher/deletePublisher.php?id=${id}`).pipe(
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

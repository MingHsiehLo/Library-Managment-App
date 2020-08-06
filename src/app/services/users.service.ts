import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IStudent, Student, Fee  } from '../modal/modal';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getInfo(): Observable<IStudent[]>{

    const headers: HttpHeaders = new HttpHeaders();

    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.http.get<Student[]>(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/user/getUsers.php',
      {headers}
    ).pipe(
        map((res: any) => {
          return res.map(element => {
            const status: string = element.status === '1' ? 'true' : 'false';
            const type: string = element.type === '1' ? 'true' : 'false';
            return new Student(
              element.id_students,
              element.password,
              element.first_name,
              element.last_name,
              status,
              element.phone_number,
              element.email,
              type,
              element.requested_books
            );
          });
        }),
        catchError(this.handleError)
    );
  }

  postInfo(studentInfo: IStudent): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/user/postUser.php',
      JSON.stringify(studentInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateInfo(studentInfo: IStudent): Observable<any> {
    return this.http.post(
      'https://thefoundationlibrary.000webhostapp.com/foundation-api/user/modifyUser.php',
      JSON.stringify(studentInfo)
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteInfo(studentId: number): Observable<any> {
    const id = studentId;
    return this.http.post(`https://thefoundationlibrary.000webhostapp.com/foundation-api/user/deleteUser.php?id=${id}`, null).pipe(
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

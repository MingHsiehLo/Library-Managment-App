import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '../components/books/books';
import { Student, IStudent, Fee } from '../components/students/students';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  getInfo(): Observable<IStudent[]>{

    let headers: HttpHeaders = new HttpHeaders;

    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');

    return this.http.get<Student[]>('http://softwood-plastics.000webhostapp.com/api/library-php/students/getStudents.php', {headers: headers}).pipe(
      map((res: any) => {
        return res.map(element => {
          let status: string = element.status === '1' ? 'true' : 'false';
          return new Student(
            element.id_students,
            element.password,
            element.first_name,
            element.last_name,
            status,
            element.phone_number,
            element.email,
            element.requested_books
          )
        })
      }),
      catchError(this.handleError)
    );
  }

  postInfo(studentInfo: IStudent): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/students/postStudent.php', JSON.stringify(studentInfo)).pipe(
      catchError(this.handleError)
    );
  }

  updateInfo(studentInfo: IStudent): Observable<any> {
    return this.http.post('http://softwood-plastics.000webhostapp.com/api/library-php/students/modifyStudent.php', JSON.stringify(studentInfo)).pipe(
      catchError(this.handleError)
    );
  }

  deleteInfo(studentId: number): Observable<any> {
    const id = studentId;
    return this.http.get(`http://softwood-plastics.000webhostapp.com/api/library-php/students/deleteStudent.php?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  retrieveFees(studentId: number): Observable<any> {
    const id = studentId;
    return this.http.get(`http://softwood-plastics.000webhostapp.com/api/library-php/students/retrieveFees.php?id=${id}`).pipe(
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

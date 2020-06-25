import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStudent } from '../components/students/students';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isUserLogged = new Subject<boolean>();

  constructor(private http: HttpClient) {

  };

  login(email: string, pass: string): Observable<any> {
    const payload = {
      email: email,
      pass: pass
    };
    return this.http.post<any>('http://softwood-plastics.000webhostapp.com/api/library-php/service/login.php', JSON.stringify(payload));
  }

  newUser(user: IStudent) {
    return this.http.post<any>('http://softwood-plastics.000webhostapp.com/api/library-php/service/newUser.php', JSON.stringify(user))
  }

}

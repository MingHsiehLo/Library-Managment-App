import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../modal/modal';


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
    return this.http.post<any>('https://thefoundationlibrary.000webhostapp.com/foundation-api/login/login.php', JSON.stringify(payload));
  }

  newUser(user: IStudent) {
    return this.http.post<any>('https://thefoundationlibrary.000webhostapp.com/foundation-api/login/newUser.php', JSON.stringify(user))
  }

}

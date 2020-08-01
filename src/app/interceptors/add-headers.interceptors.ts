import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddHeadersInterceptor implements HttpInterceptor{

  constructor() { }
  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const modifReq: HttpRequest<any> = req.clone({
      setHeaders: {'Content-Type': 'text/plain'}
    });

    return next.handle(modifReq);
  }
}

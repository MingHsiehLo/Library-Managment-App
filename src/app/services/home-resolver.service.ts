import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Featured } from '../modal/modal';
import { BooksService } from './books.service';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService implements Resolve<Featured[] | string> {

  constructor(private bookService: BooksService) { }
  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<string | Featured[]> {
    return this.bookService.getFeatured().pipe(
      catchError(err => of(err))
    );
  }
}

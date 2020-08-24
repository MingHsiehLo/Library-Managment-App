import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Book } from '../shared/modal';
import { BooksService } from './books.service';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksResolverService implements Resolve<Book[] | string> {

  constructor(private bookService: BooksService) { }
  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<string | Book[]> {
    return this.bookService.getInfo().pipe(
      catchError(err => of(err))
    );
  }
}

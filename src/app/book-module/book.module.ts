// Modules
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

// Components
import { BooksComponent } from './components/books/books.component';
import { AuthorComponent } from './components/author/author.component';
import { GenreComponent } from './components/genre/genre.component';
import { PublisherComponent } from './components/publisher/publisher.component';


@NgModule({
  declarations: [
    BooksComponent,
    AuthorComponent,
    GenreComponent,
    PublisherComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: BooksComponent },
      { path: ':isbn/isbn', component: BooksComponent },
      { path: ':author/author', component: BooksComponent },
      { path: 'author', component: AuthorComponent },
      { path: 'genre', component: GenreComponent },
      { path: 'publisher', component: PublisherComponent }
    ])
  ]
})
export class BookModule { }

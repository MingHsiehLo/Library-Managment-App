import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Book, IExportingBook, IPostingBook, IEditingBook, IRequest, IReturn, IPayment, IRequestUser, IStudent } from 'src/app/modal/modal';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthorService } from 'src/app/services/author.service';
import { GenreService } from 'src/app/services/genre.service';
import { FeeService } from 'src/app/services/fee.service';
import { PublisherService } from 'src/app/services/publisher.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})

export class BooksComponent implements OnInit, AfterViewInit {

  page = 1;
  pageSize = 4;
  collectionSize: number;

  get bookArray(): Book[] {
    return this.requestResult
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  userAdmin: boolean;
  tableTitles: string[] = ['Title', 'Author', 'Publisher', 'Genre', 'ISBN', 'Copies'];
  requestResult: Book[] = [];
  books: Book[] = [];
  authors: any[] = [];
  genre: any[] = [];
  publishers: any[] = [];
  edit = false;
  enableMessage = 'Enable Edit';
  users: IStudent[] = [];
  requestError = false;
  requestErrorMessage: string;
  alertType: string;
  returnDate: any;
  fee = false;
  feeAmount: number;
  id_loan: number;
  paymentAlert = false;
  paymentMessage: string;
  ISBN: string;
  author: string;

  requestUserAlert = false;
  requestUserMessage: string;

  private _searchOptionInfo: string;
  searchOptionCategory = 'title';

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult =
      this._searchOptionInfo && this.searchOptionCategory ? this.performFilter(value, this.searchOptionCategory) : this.books;
    this.collectionSize = this.requestResult.length;
  }

  payOb: IPayment = {
    id_students: null,
    id_loan: null,
    returned_date: null
  };

  returnedInfo: IReturn = {
    id_students: null,
    id_isbn: null,
    returned_date: null,
    authorized_admin: null
  };

  requestInfo: IRequest = {
    id_students: null,
    id_isbn: null,
    out_date: null,
    due_date: null,
    authorized_admin: null
  };

  requestUserInfo: IRequestUser = {
    id_students: null,
    id_isbn: null,
    order_date: null,
    payment_date_check: null,
    authorized_admin: null
  };

  request: any = {
    outDate: null,
    user: {
      first_name: null,
      last_name: null,
      status: null
    }
  };

  set userFullName(value){

  }

  get userFullName(){
    if (this.request.user === null) {
      return null;
    }
    else if (this.request.user.last_name === null && this.request.user.first_name === null){
      return null;
    }
    else {
      return `${this.request.user.last_name}, ${this.request.user.first_name}`;
    }
  }

  set userStatus(value){
  }

  get userStatus(){
    if (this.request.user === null) {
      return null;
    }
    else if (this.request.user.status === null){
      return null;
    }
    else if (this.request.user.status === 'true') {
      return 'Active';
    }
    else {
      return 'Not Active';
    }
  }

  selectedBookInfo: IEditingBook = {
    id_isbn: null,
    title: null,
    availability: null,
    copy_number: null,
    dewey_code: null,
    authorFirstName: null,
    authorLastName: null,
    author: null,
    publisher: null,
    genre: null,
  };

  bookAlert = false;
  bookMessage: string;
  bookForm: FormGroup;
  newGenreForm: FormGroup;
  newAuthorForm: FormGroup;
  newPublisherForm: FormGroup;
  newEditForm: FormGroup;

  constructor(
    private booksService: BooksService,
    private detectorService: ChangeDetectorRef,
    private router: Router,
    private authorService: AuthorService,
    private genreService: GenreService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private publisherService: PublisherService,
    private authService: AuthService,
    private usersService: UsersService,
    private feeService: FeeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const elements = document.querySelectorAll('div.modal-backdrop');
        elements.forEach(element => element.classList.remove('modal-backdrop'));
      }
    });
    this.ISBN = this.activatedRoute.snapshot.params.isbn;
    this.author = this.activatedRoute.snapshot.params.author;
  }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      id_isbn: [null, [Validators.required]],
      title: [null, [Validators.required]],
      availability: ['true', [Validators.required]],
      copy_number: [null, [Validators.required]],
      author: [null, [Validators.required]],
      dewey_code: null,
      genre: [null, [Validators.required]],
      publisher: [null, [Validators.required]],
    });

    this.newEditForm = this.fb.group({
      id_isbn: [{value: null, disabled: true}],
      title: null,
      availability: null,
      copy_number: null,
      author: null,
      publisher: null,
      genre: null,
    });

    this.newGenreForm = this.fb.group({
      id_genre: null,
      description_genre: [null, [Validators.required]]
    });

    this.newAuthorForm = this.fb.group({
      id_author: null,
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]]
    });

    this.newPublisherForm = this.fb.group({
      id_publisher: null,
      description_publisher: [null, [Validators.required]]
    });

    this.userAdmin = this.authService.retrieveUserType();
    this.getBooks();
    this.retrieveAuthors();
    this.retrieveGenres();
    this.retrievePublishers();
    this.getStudents();
  }

  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready(() => {
      $('#newEntry').on('hide.bs.modal', () => {
        (document.querySelector('form[name="newEntry"]') as HTMLFormElement).reset();
        thisComponent.bookForm.patchValue({
          availability: 'true'
        });
        thisComponent.detectorService.detectChanges();
      });
      $('#newAuthor').on('hide.bs.modal', () => {
        if ((document.querySelector('form[name="newAuthor"]') as HTMLFormElement) !== null) {
          (document.querySelector('form[name="newAuthor"]') as HTMLFormElement).reset();
        }
      });
      $('#newGenre').on('hide.bs.modal', () => {
        if ((document.querySelector('form[name="newGenre"]') as HTMLFormElement) !== null) {
          (document.querySelector('form[name="newGenre"]') as HTMLFormElement).reset();
        }
      });
      $('#newPublisher').on('hide.bs.modal', () => {
        if ((document.querySelector('form[name="newPublisher"]') as HTMLFormElement) !== null) {
          (document.querySelector('form[name="newPublisher"]') as HTMLFormElement).reset();
        }
      });
    });
  }

  performFilter(searchBy: string, category: string) {

    category !== 'id_isbn' ? searchBy = searchBy.toLowerCase() : searchBy = searchBy;

    switch (category) {
      case 'id_isbn':
        return this.books.filter(element =>
          element.id_isbn.toString().indexOf(searchBy) !== -1
          );
      case 'title':
        return this.books.filter(element =>
          element.title.toLowerCase().indexOf(searchBy) !== -1
        );
      case 'author':
        return this.books.filter(element => {
          const authorFullName = `${element.authorFirstName} ${element.authorLastName}`;
          return authorFullName.toLowerCase().indexOf(searchBy) !== -1;
        });
      case 'publisher':
        return this.books.filter(element =>
          element.publisher.toLowerCase().indexOf(searchBy) !== -1
        );
      case 'genre':
        return this.books.filter(element =>
          element.genre.toLowerCase().indexOf(searchBy) !== -1
        );
    }
  }

  editSelectedBook(data: IEditingBook) {
    this.selectedBookInfo = {...data};
    this.selectedBookInfo.author = `${this.selectedBookInfo.authorFirstName}*${this.selectedBookInfo.authorLastName}`;
    this.newEditForm.patchValue({...this.selectedBookInfo});
  }

  selectedBook(data: IEditingBook) {
    this.id_loan = null;
    this.selectedBookInfo = {...data};
    this.selectedBookInfo.author = `${this.selectedBookInfo.authorFirstName}*${this.selectedBookInfo.authorLastName}`;
  }

  getBooks(){
    return new Promise((resolve, reject) => {
      this.booksService.getInfo().subscribe({
        next: data => {
          this.requestResult = data.sort((a, b) => (a.title > b.title) ? 1 : (b.title > a.title) ? -1 : 0), this.books = this.requestResult;
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => {
      this.collectionSize = this.requestResult.length;
      if (this.ISBN){
        this._searchOptionInfo = this.ISBN;
        this.searchOptionCategory = 'id_isbn';
        this.requestResult = this.performFilter(this.ISBN, 'id_isbn');
        this.collectionSize = this.requestResult.length;
      }
      else if (this.author){
        this._searchOptionInfo = this.author;
        this.searchOptionCategory = 'author';
        this.requestResult = this.performFilter(this.author, 'author');
        this.collectionSize = this.requestResult.length;
      }
    });
  }

  processedBookInfo(bookObject: IPostingBook|IEditingBook){
    let authorId: string;
    let genreId: string;
    let publisherId: string;
    const postBookAuthor = bookObject.author.split('*');
    for (const element of this.authors){
      (postBookAuthor[0] === element.firstName && postBookAuthor[1] === element.lastName) ? authorId = element.id_author : null ;
    }
    for (const element of this.genre){
      bookObject.genre === element.description_genre ? genreId = element.id_genre : null ;
    }
    for (const element of this.publishers){
      bookObject.publisher === element.description_publisher ? publisherId = element.id_publisher : null ;
    }
    const random = () => Math.floor((Math.random() * (10 - 1)) + 1);
    const dewey_code = `${random()}${random()}${random()}.${random()}${random()}`;

    const postingBookInfo: IExportingBook = {
      id_isbn: bookObject.id_isbn,
      title: bookObject.title,
      availability: bookObject.availability,
      copy_number: bookObject.copy_number,
      dewey_code: parseFloat(dewey_code),
      id_author: parseInt(authorId, 10),
      id_genre: parseInt(genreId, 10),
      id_publisher: parseInt(publisherId, 10)
    };

    return postingBookInfo;
  }

  postBooks(form: FormGroup){
    if (form.valid) {
      return new Promise ((resolve, reject) => {
        this.booksService.postInfo(this.processedBookInfo(form.value)).subscribe({
          next: data => {
            if (data.resultado === 'OK') {
              this.bookAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.bookAlert = false, 3000);
              this.bookMessage = 'Book added successfully.';
            }
            resolve(true);
          },
          error: error => {
            console.log(error);
            resolve(false);
            this.bookAlert = true;
            this.alertType = 'danger';
            setTimeout(() => this.bookAlert = false, 3000);
            this.bookMessage = 'Book was not added.';
          }
        });
      }).then(() => this.getBooks());
    }
  }

  updateBooks(editForm: FormGroup){
    if (editForm.valid) {
      this.selectedBookInfo.title = editForm.value.title;
      this.selectedBookInfo.author = editForm.value.author;
      this.selectedBookInfo.genre = editForm.value.genre;
      this.selectedBookInfo.publisher = editForm.value.publisher;
      this.selectedBookInfo.availability = editForm.value.availability;
      this.selectedBookInfo.copy_number = editForm.value.copy_number;
      return new Promise((resolve, reject) => {
        this.booksService.updateInfo(this.processedBookInfo(this.selectedBookInfo)).subscribe({
          next: data => {
            if (data.resultado === 'OK') {
              this.bookAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.bookAlert = false, 3000);
              this.bookMessage = 'Book successfully modified.';
            }
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.getBooks());
    }
  }

  deleteBook(isbn: number){
    return new Promise((resolve, reject) => {
      this.booksService.deleteInfo(isbn).subscribe({
        next: data => {
          if (data.resultado === 'OK') {
            this.bookAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.bookAlert = false, 3000);
            this.bookMessage = 'Book successfully deleted.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.getBooks());
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

  retrieveAuthors(){
    return new Promise((resolve, reject) => {
      this.authorService.retrieveAuthors('author').subscribe({
        next: data => { this.authors = data, resolve(true); },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.authors = this.authors.sort((a, b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0)));
  }

  retrieveGenres(){
    return new Promise((resolve, reject) => {
      this.genreService.retrieveGenre('genre').subscribe({
        next: data => { this.genre = data, resolve(true); },
        error: err => { console.log(err), resolve(false); }
      });
    })
    .then(
      () => {
        this.genre = this.genre.sort(
          (a, b) => (a.description_genre > b.description_genre) ? 1 : ((b.description_genre > a.description_genre) ? -1 : 0)
        );
      }
    );
  }

  retrievePublishers(){
    return new Promise((resolve, reject) => {
      this.publisherService.retrievePublisher('publisher').subscribe({
        next: data => { this.publishers = data, resolve(true); },
        error: err => { console.log(err), resolve(false); }
      });
    })
    .then(
      () => this.publishers = this.publishers.sort(
        (a, b) => (a.description_publisher > b.description_publisher) ? 1 : ((b.description_publisher > a.description_publisher) ? -1 : 0))
      );
  }

  postAuthor(authorForm: FormGroup){
    if (authorForm.valid) {
      return new Promise((resolve, reject) => {
        this.authorService.postAuthor(authorForm.value).subscribe({
          next: data => {
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.retrieveAuthors());
    }
  }

  postGenre(genreForm: FormGroup){
    if (genreForm.valid) {
      return new Promise((resolve, reject) => {
        this.genreService.postGenre(genreForm.value).subscribe({
          next: data => {
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.retrieveGenres());
    }
  }

  postPublisher(publisherForm: FormGroup){
    if (publisherForm.valid) {
      return new Promise((resolve, reject) => {
        this.publisherService.postPublisher(publisherForm.value).subscribe({
          next: data => {
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.retrievePublishers());
    }
  }

  enableEdit(){
    this.edit = !this.edit;
    this.edit ? this.enableMessage = 'Disable Edit' : this.enableMessage = 'Enable Edit';
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  payNow(){
    this.payOb.id_loan = +this.id_loan;
    this.payOb.id_students = +this.request.user.id_students;
    const return_date = new Date(this.returnDate.year, this.returnDate.month - 1, this.returnDate.day);
    this.payOb.returned_date = `${return_date.getFullYear()}-${return_date.getMonth() + 1}-${return_date.getDate()}`;
    return new Promise((resolve, reject) => {
      this.feeService.payNow(this.payOb).subscribe({
        next: data => {
          if (data.result === '404') {
            this.paymentAlert = true;
            setTimeout(() => this.paymentAlert = false, 6000);
            this.paymentMessage = data.message;
            this.alertType = 'danger';
          }
          else if (data.result === '200') {
            this.paymentAlert = true;
            setTimeout(() =>  this.paymentAlert = false, 3000);
            this.paymentMessage = data.message;
            this.alertType = 'success';
            setTimeout(() => this.fee = false, 3000);
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.id_loan = null);
  }

  returnBook(form: NgForm){
    if (form.valid) {
      if (this.request.user !== null){
        if (this.request.user.status !== undefined && this.request.user.status !== null) {
          if (this.request.user.status === 'true') {
            if (this.request.user.first_name !== null && this.request.user.last_name !== null) {
              const userId = +localStorage.getItem('userId');
              const return_date = new Date(this.returnDate.year, this.returnDate.month - 1, this.returnDate.day);
              this.returnedInfo.id_students = +this.request.user.id_students;
              this.returnedInfo.id_isbn = +this.selectedBookInfo.id_isbn;
              this.returnedInfo.returned_date = `${return_date.getFullYear()}-${return_date.getMonth() + 1}-${return_date.getDate()}`;
              this.returnedInfo.authorized_admin = userId;

              return new Promise((resolve, reject) => {
                this.booksService.returnBook(this.returnedInfo).subscribe({
                  next: data => {
                    if (data.result === '404') {
                      this.requestError = true;
                      setTimeout(() => this.requestError = false, 3000);
                      this.requestErrorMessage = data.message;
                      this.alertType = 'danger';
                    }
                    else if (data.result === '200') {
                      this.requestError = true;
                      setTimeout(() => this.requestError = false, 3000);
                      this.requestErrorMessage = data.message;
                      this.alertType = 'success';
                      if (data.fee !== 0){
                        this.fee = true;
                        this.feeAmount = data.fee;
                        this.id_loan = data.idLoan;
                      }
                    }
                    resolve(true);
                  },
                  error: err => { console.log(err), resolve(false); }
                });
              }).then(() => this.getBooks());
            }
          }
          else {
            this.requestError = true;
            setTimeout(() => this.requestError = false, 3000);
            this.requestErrorMessage = 'Return Error: User not active.';
            this.alertType = 'danger';
          }
        }
        else {
          this.requestError = true;
          setTimeout(() => this.requestError = false, 3000);
          this.requestErrorMessage = 'Return Error: User not selected.';
          this.alertType = 'danger';
        }
      }
      else {
        this.requestError = true;
        setTimeout(() => this.requestError = false, 3000);
        this.requestErrorMessage = 'Return Error: User not selected.';
        this.alertType = 'danger';
      }
    }
  }

  requestBook(form: NgForm){
    if (form.valid) {
      if (this.request.user !== null){
        if (this.request.user.status !== undefined && this.request.user.status !== null) {
          if (this.request.user.status === 'true') {
            if (this.request.user.first_name !== null && this.request.user.last_name !== null) {

              const userId = +localStorage.getItem('userId');
              const out_date = new Date(this.request.outDate.year, this.request.outDate.month - 1, this.request.outDate.day);
              const due_date = this.addDays(out_date, 7);

              this.requestInfo.id_students = +this.request.user.id_students;
              this.requestInfo.id_isbn = +this.selectedBookInfo.id_isbn;
              this.requestInfo.out_date = `${out_date.getFullYear()}-${out_date.getMonth() + 1}-${out_date.getDate()}`;
              this.requestInfo.due_date = `${due_date.getFullYear()}-${due_date.getMonth() + 1}-${due_date.getDate()}`;
              this.requestInfo.authorized_admin = userId;

              return new Promise((resolve, reject) => {
                this.booksService.requestBook(this.requestInfo).subscribe({
                  next: data => {
                    if (data.result === '404') {
                      this.requestError = true;
                      setTimeout(() => this.requestError = false, 3000);
                      this.requestErrorMessage = data.message;
                      this.alertType = 'danger';
                    }
                    else if (data.result === '200') {
                      this.requestError = true;
                      setTimeout(() => this.requestError = false, 3000);
                      this.requestErrorMessage = data.message;
                      this.alertType = 'success';
                    }
                    resolve(true);
                  },
                  error: err => { console.log(err), resolve(false); }
                });
              }).then(() => {this.getBooks(); console.log('Requested books!'); });
            }
          }
          else {
            this.requestError = true;
            setTimeout(() => this.requestError = false, 3000);
            this.requestErrorMessage = 'Request Error: User not active.';
            this.alertType = 'danger';
          }
        }
        else {
          this.requestError = true;
          setTimeout(() => this.requestError = false, 3000);
          this.requestErrorMessage = 'Request Error: User not selected.';
          this.alertType = 'danger';
        }
      }
      else {
        this.requestError = true;
        setTimeout(() => this.requestError = false, 3000);
        this.requestErrorMessage = 'Request Error: User not selected.';
        this.alertType = 'danger';
      }
    }
    else {
      this.requestError = true;
      setTimeout(() => this.requestError = false, 3000);
      this.requestErrorMessage = 'Request Error: Date not selected.';
      this.alertType = 'danger';
    }
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }

  getStudents(){
    this.usersService.getInfo().subscribe({
      next: data => { this.users = data; },
      error: err => console.log(err)
    });
  }

  restDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  requestBookUser(){

    const userStatus = +localStorage.getItem('status');
    if (userStatus === 1) {
      const userId = +localStorage.getItem('userId');
      const order_date = new Date();
      this.requestUserInfo.id_students = +userId;
      this.requestUserInfo.id_isbn = +this.selectedBookInfo.id_isbn;
      this.requestUserInfo.order_date = `${order_date.getFullYear()}-${order_date.getMonth() + 1}-${order_date.getDate()}`;
      const payment_date_check = this.restDays(order_date, 6);
      this.requestUserInfo.payment_date_check = `${payment_date_check.getFullYear()}-${payment_date_check.getMonth() + 1}-${payment_date_check.getDate()}`;
      this.requestUserInfo.authorized_admin = null;

      return new Promise((resolve, reject) => {
        this.booksService.requestUserBook(this.requestUserInfo).subscribe({
          next: data => {
            if (data.result === '404') {
              this.requestUserAlert = true;
              setTimeout(() => this.requestUserAlert = false, 3000);
              this.requestUserMessage = data.message;
              this.alertType = 'danger';
            }
            else if (data.result === '200') {
              this.requestUserAlert = true;
              setTimeout(() => this.requestUserAlert = false, 3000);
              this.requestUserMessage = data.message;
              this.alertType = 'success';
            }
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.getBooks());
    }
    else {
      this.requestUserAlert = true;
      setTimeout(() => this.requestUserAlert = false, 3000);
      this.requestUserMessage = 'Request Error: User not active.';
      this.alertType = 'danger';
    }
  }

}

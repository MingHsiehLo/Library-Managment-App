import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Author } from 'src/app/shared/modal';
import { AuthorService } from 'src/app/services/author.service';
import { AuthService } from 'src/app/services/auth.service';
import * as $ from 'jquery';
import 'bootstrap';


@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit, AfterViewInit {

  tableTitles: string[] = ['#', 'Last Name', 'First Name'];
  requestResult: Author[] = [];
  authors: Author[] = [];
  userAdmin: boolean;

  private _searchOptionInfo: string;

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult = this._searchOptionInfo ? this.performFilter(value) : this.authors;
  }

  selectedAuthorInfo: Author = {
    id_author: null,
    firstName: null,
    lastName: null
  };

  alertType: string;
  authorAlert = false;
  authorMessage: string;

  authorForm: FormGroup;

  constructor(
    private authorService: AuthorService,
    private detectorService: ChangeDetectorRef,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.authorForm = this.fb.group({
      pFirstNameField: [null, [Validators.required]],
      pLastNameField: [null, [Validators.required]]
    });
    this.userAdmin = this.authService.retrieveUserType();
    this.retrieveAuthors();
  }

  /* Used JQuery to toggle the modal built-in class and reset the form if someone leaves it */
  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready(() => {
      $('#newAuthor').on('hide.bs.modal', () => {
        (document.querySelector('form[name="newAuthor"]') as HTMLFormElement).reset();
        thisComponent.detectorService.detectChanges();
      });
    });
  }


  performFilter(searchBy: string) {
    searchBy = searchBy.toLowerCase();
    return this.requestResult.filter(element => {
      const authorFullName = `${element.firstName} ${element.lastName}`;
      return authorFullName.toLowerCase().indexOf(searchBy) !== -1;
    });
  }

  selectedAuthor(data: Author) {
    this.selectedAuthorInfo = data;
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
    })
    .then(() => {
      this.authors =
      this.authors.sort(
        (a, b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0)), this.requestResult = this.authors;
      });
  }

  postAuthor(authorForm: FormGroup){
    if (authorForm.valid) {
      const authorInfo = new Author(null, authorForm.value.pFirstNameField, authorForm.value.pLastNameField);
      return new Promise((resolve, reject) => {
        this.authorService.postAuthor(authorInfo).subscribe({
          next: data => {
            if (data.resultado === 'OK') {
              this.authorAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.authorAlert = false, 3000);
              this.authorMessage = 'Author added successfully.';
            }
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.retrieveAuthors());
    }
  }

  deleteAuthor(id: number){
    return new Promise((resolve, reject) => {
      this.authorService.deleteAuthor(id).subscribe({
        next: data => {
          if (data.resultado === 'OK') {
            this.authorAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.authorAlert = false, 3000);
            this.authorMessage = 'Author successfully deleted.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.retrieveAuthors());
  }

  modifyAuthor(authorInfo: Author){
    return new Promise((resolve, reject) => {
      this.authorService.modifyAuthor(authorInfo).subscribe({
        next: data => {
          if (data.resultado === 'OK') {
            this.authorAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.authorAlert = false, 3000);
            this.authorMessage = 'Author successfully modified.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.retrieveAuthors());
  }

}

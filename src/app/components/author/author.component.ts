import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';
import { NgForm } from '@angular/forms';
import { Author } from '../books/books';
import { AuthorService } from 'src/app/services/author.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit, AfterViewInit {

  tableTitles: string[] = ['#', 'Last Name', 'First Name']
  requestResult: Author[] = [];
  authors: Author[] = [];
  userAdmin: boolean;

  private _searchOptionInfo: string;

  get searchOptionInfo(){
    return this._searchOptionInfo
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult = this._searchOptionInfo ? this.performFilter(value) : this.authors;
  }

  selectedAuthorInfo: Author = {
    id_author: null,
    firstName: null,
    lastName: null
  }

  postAuthorInfo: Author = {
    id_author: null,
    firstName: null,
    lastName: null
  }

  alertType: string;
  authorAlert: boolean = false;
  authorMessage: string;

  constructor(private authorService: AuthorService, private detectorService: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {

    this.userAdmin = this.authService.retrieveUserType();
    this.retrieveAuthors();
  }

  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready(function(){
      $('#newAuthor').on('hide.bs.modal', function () {
        (document.querySelector("form[name='newAuthor']") as HTMLFormElement).reset();
        thisComponent.detectorService.detectChanges();
      });
    })
  }


  performFilter(searchBy: string) {

    searchBy = searchBy.toLowerCase();
    return this.requestResult.filter(element => {
      let authorFullName = `${element.firstName} ${element.lastName}`;
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
        next: data => { this.authors = data, resolve(true) },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => {this.authors = this.authors.sort((a,b) => (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0)), this.requestResult = this.authors})
  }

  postAuthor(authorForm: NgForm){
    if (authorForm.valid) {
      return new Promise((resolve, reject) => {
        this.authorService.postAuthor(this.postAuthorInfo).subscribe({
          next: data => {
            if(data.resultado === 'OK') {
              this.authorAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.authorAlert = false, 3000);
              this.authorMessage = 'Author added successfully.';
            }
            resolve(true)
          },
          error: err => { console.log(err), resolve(false)}
        })
      }).then(() => this.retrieveAuthors())
        .then(() => {
          this.postAuthorInfo = {
            id_author: null,
            firstName: null,
            lastName: null
          }
        })
    }
  }

  deleteAuthor(id: number){
    return new Promise((resolve, reject) => {
      this.authorService.deleteAuthor(id).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.authorAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.authorAlert = false, 3000);
            this.authorMessage = 'Author successfully deleted.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrieveAuthors());
  }

  modifyAuthor(authorInfo: Author){
    return new Promise((resolve, reject) => {
      this.authorService.modifyAuthor(authorInfo).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.authorAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.authorAlert = false, 3000);
            this.authorMessage = 'Author successfully modified.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrieveAuthors());
  }

}

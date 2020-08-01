import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Genre } from 'src/app/modal/modal';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { GenreService } from 'src/app/services/genre.service';
import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit, AfterViewInit {

  tableTitles: string[] = ['#', 'Description'];
  requestResult: Genre[] = [];
  genre: Genre[] = [];
  userAdmin: boolean;

  private _searchOptionInfo: string;

  get searchOptionInfo(){
    return this._searchOptionInfo;
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult = this._searchOptionInfo ? this.performFilter(value) : this.genre;
  }

  selectedGenreInfo: Genre = {
    id_genre: null,
    description_genre: null
  };

  alertType: string;
  genreAlert = false;
  genreMessage: string;

  genreForm: FormGroup;

  constructor(
    private genreService: GenreService,
    private detectorService: ChangeDetectorRef,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.genreForm = this.fb.group({
      pGenreField: [null, [Validators.required]]
    });
    this.userAdmin = this.authService.retrieveUserType();
    this.retrieveGenres();
  }

  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready( () => {
      $('#newGenre').on('hide.bs.modal', () => {
        (document.querySelector('form[name="newGenre"]') as HTMLFormElement).reset();
        thisComponent.detectorService.detectChanges();
      });
    });
  }


  performFilter(searchBy: string) {
    searchBy = searchBy.toLowerCase();
    return this.requestResult.filter(element => {
      return element.description_genre.toLowerCase().indexOf(searchBy) !== -1;
    });
  }

  selectedGenre(data: Genre) {
    this.selectedGenreInfo = data;
  }

  clearSearch(){
    this.searchOptionInfo = null;
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
        ),
        this.requestResult = this.genre;
      }
    );
  }

  postGenre(genreForm: FormGroup){
    if (genreForm.valid) {
      const postGenreInfo = {
        id_genre: null,
        description_genre: genreForm.value.pGenreField
      };
      return new Promise((resolve, reject) => {
        this.genreService.postGenre(postGenreInfo).subscribe({
          next: data => {
            if (data.resultado === 'OK') {
              this.genreAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.genreAlert = false, 3000);
              this.genreMessage = 'Genre added successfully.';
            }
            resolve(true);
          },
          error: err => { console.log(err), resolve(false); }
        });
      }).then(() => this.retrieveGenres());
    }
  }

  deleteGenre(id: number){
    return new Promise((resolve, reject) => {
      this.genreService.deleteGenre(id).subscribe({
        next: data => {
          if (data.resultado === 'OK') {
            this.genreAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.genreAlert = false, 3000);
            this.genreMessage = 'Genre successfully deleted.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.retrieveGenres());
  }

  modifyGenre(genreInfo: Genre){
    return new Promise((resolve, reject) => {
      this.genreService.modifyGenre(genreInfo).subscribe({
        next: data => {
          if (data.resultado === 'OK') {
            this.genreAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.genreAlert = false, 3000);
            this.genreMessage = 'Genre successfully modified.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false); }
      });
    }).then(() => this.retrieveGenres());
  }


}

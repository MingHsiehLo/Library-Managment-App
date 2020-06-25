import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Publisher } from '../books/books';
import * as $ from 'jquery';
import 'bootstrap';
import { PublisherService } from 'src/app/services/publisher.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit {

  tableTitles: string[] = ['#', 'Description']
  requestResult: Publisher[] = [];
  publisher: Publisher[] = [];
  userAdmin: boolean;

  private _searchOptionInfo: string;

  get searchOptionInfo(){
    return this._searchOptionInfo
  }

  set searchOptionInfo(value: string) {
    this._searchOptionInfo = value;
    this.requestResult = this._searchOptionInfo ? this.performFilter(value) : this.publisher;
  }

  selectedPublisherInfo: Publisher = {
    id_publisher: null,
    description_publisher: null
  }

  postPublisherInfo: Publisher = {
    id_publisher: null,
    description_publisher: null
  }

  alertType: string;
  publisherAlert: boolean = false;
  publisherMessage: string;

  constructor(private publisherService: PublisherService, private detectorService: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.userAdmin = this.authService.retrieveUserType();
    this.retrievePublishers();
  }

  ngAfterViewInit(): void {
    const thisComponent = this;
    $(document).ready(function(){
      $('#newPublisher').on('hide.bs.modal', function () {
        (document.querySelector("form[name='newPublisher']") as HTMLFormElement).reset();
        thisComponent.detectorService.detectChanges();
      });
    })
  }


  performFilter(searchBy: string) {

    searchBy = searchBy.toLowerCase();
    return this.requestResult.filter(element => {
      return element.description_publisher.toLowerCase().indexOf(searchBy) !== -1;
    });

  }

  selectedPublisher(data: Publisher) {
    this.selectedPublisherInfo = data;
  }

  clearSearch(){
    this.searchOptionInfo = null;
  }

  retrievePublishers(){
    return new Promise((resolve, reject) => {
      this.publisherService.retrievePublisher('publisher').subscribe({
        next: data => { this.publisher = data, resolve(true) },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => { this.publisher = this.publisher.sort((a,b) => (a.description_publisher > b.description_publisher) ? 1 : ((b.description_publisher > a.description_publisher) ? -1 : 0)), this.requestResult = this.publisher })
  }

  postPublisher(publisherForm: NgForm){
    if (publisherForm.valid) {
      return new Promise((resolve, reject) => {
        this.publisherService.postPublisher(this.postPublisherInfo).subscribe({
          next: data => {
            if(data.resultado === 'OK') {
              this.publisherAlert = true;
              this.alertType = 'success';
              setTimeout(() => this.publisherAlert = false, 3000);
              this.publisherMessage = 'Publisher added successfully.';
            }
            resolve(true);
          },
          error: err => { console.log(err), resolve(false) }
        })
      }).then(() => this.retrievePublishers())
        .then(() => {
          this.postPublisherInfo = {
            id_publisher: null,
            description_publisher: null
          }
        })
    }
  }

  deletePublisher(id: number){
    return new Promise((resolve, reject) => {
      this.publisherService.deletePublisher(id).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.publisherAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.publisherAlert = false, 3000);
            this.publisherMessage = 'Publisher successfully deleted.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrievePublishers());
  }

  modifyPublisher(publisherInfo: Publisher){
    return new Promise((resolve, reject) => {
      this.publisherService.modifyPublisher(publisherInfo).subscribe({
        next: data => {
          if(data.resultado === 'OK') {
            this.publisherAlert = true;
            this.alertType = 'success';
            setTimeout(() => this.publisherAlert = false, 3000);
            this.publisherMessage = 'Publisher successfully modified.';
          }
          resolve(true);
        },
        error: err => { console.log(err), resolve(false) }
      })
    }).then(() => this.retrievePublishers());
  }

}

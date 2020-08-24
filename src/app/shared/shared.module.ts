import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConvertToNoDataPipe } from './convert-to-no-data.pipe';
import { ConvertToPendingPipe } from './convert-to-pending.pipe';

@NgModule({
  declarations: [
    ConvertToNoDataPipe,
    ConvertToPendingPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    ConvertToNoDataPipe,
    ConvertToPendingPipe
  ]
})
export class SharedModule { }

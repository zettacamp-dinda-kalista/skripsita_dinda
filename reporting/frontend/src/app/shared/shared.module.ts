import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

@NgModule({
      declarations: [],
      imports: [
            CommonModule,
            ReactiveFormsModule,
            HttpClientModule,
            MaterialModule
      ],
      exports: [
            ReactiveFormsModule,
            HttpClientModule,
            MaterialModule
      ]
})
export class SharedModule { }

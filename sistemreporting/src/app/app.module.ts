import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';

import { AddReportDialogComponent } from './add-report-dialog/add-report-dialog.component';

@NgModule({
      declarations: [
            AppComponent,
            AddReportDialogComponent
      ],
      imports: [
            BrowserModule,
            AppRoutingModule,
            BrowserAnimationsModule,
            ReactiveFormsModule,
            HttpClientModule,
            MatToolbarModule,
            MatButtonModule,
            MatIconModule,
            MatTableModule,
            MatFormFieldModule,
            MatInputModule,
            MatDialogModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatSelectModule,
            MatProgressBarModule,
            MatPaginatorModule
      ],
      providers: [
            MatDatepickerModule
      ],
      bootstrap: [AppComponent]
})
export class AppModule { }

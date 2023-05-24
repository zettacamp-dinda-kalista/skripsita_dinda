import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import { AddReportDialogComponent } from './add-report-dialog/add-report-dialog.component';
import { ShellComponent } from './shell/shell.component';
import { TopbarComponent } from './shell/topbar/topbar.component';
import { NavComponent } from './shell/nav/nav.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
      declarations: [
            AppComponent,
            AddReportDialogComponent,
            ShellComponent,
            TopbarComponent,
            NavComponent,
            LoginComponent
      ],
      imports: [
            BrowserModule,
            AppRoutingModule,
            BrowserAnimationsModule,
            SharedModule
      ],
      bootstrap: [AppComponent]
})
export class AppModule { }

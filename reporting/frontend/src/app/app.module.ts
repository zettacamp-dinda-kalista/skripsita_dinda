import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ShellComponent } from './components/shell/shell.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
      declarations: [
            AppComponent,
            LoginComponent,
            ShellComponent,
            NavComponent
      ],
      imports: [
            BrowserModule,
            AppRoutingModule,
            BrowserAnimationsModule,
            SharedModule
      ],
      providers: [],
      bootstrap: [AppComponent]
})
export class AppModule { }

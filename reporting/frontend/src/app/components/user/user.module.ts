import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserComponent } from './user.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
    declarations: [
        UserComponent,
        UserDialogComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule
    ]
})
export class UserModule { }

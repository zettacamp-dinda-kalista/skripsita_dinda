import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueRoutingModule } from './issue-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IssueComponent } from './issue.component';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';

@NgModule({
    declarations: [
        IssueComponent,
        IssueDialogComponent
    ],
    imports: [
        CommonModule,
        IssueRoutingModule,
        SharedModule
    ]
})
export class IssueModule { }

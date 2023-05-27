import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';


@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent {
  displayedColumns: string[] = [
    'ref_id',
    'section',
    'bug_description',
    'reported_date',
    'severity',
    'due_date',
    'dev_type',
    'eta',
    'actual',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<any>([]);

  // @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;
  constructor (private dialog: MatDialog) {

  }

  ngOnInit() {

  }
  
   openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(IssueDialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }


  // helper methods

  formatDate(date: Date) {
    let d: any = date.getDate();
    let m: any = date.getMonth() + 1;
    let y: any = date.getFullYear();

    d = d < 10 ? '0' + d : d;
    m = m < 10 ? '0' + m : m;

    return d + '/' + m + '/' + y;
  }
}

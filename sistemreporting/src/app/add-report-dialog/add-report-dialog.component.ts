import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-report-dialog',
  templateUrl: './add-report-dialog.component.html',
  styleUrls: ['./add-report-dialog.component.css']
})
export class AddReportDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close(); 
  }

}

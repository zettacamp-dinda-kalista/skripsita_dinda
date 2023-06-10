import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FeatureService } from 'src/app/services/feature.service';
import { IssueService } from 'src/app/services/issue.service';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent {
    subs = new Subscription();

    dataSource = new MatTableDataSource<any[]>([]);
    displayedColumns: string[] = ['ref', 'description', 'reporter', 'reported_date', 'due_date', 'severity', 'status', 'action'];

    features: any[] = [];
    isLoading: boolean = false;

    constructor(
        private featureService: FeatureService,
        private issueService: IssueService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        this.fetchAllFeatures();
        this.fetchAllIssues();
    }

    fetchAllFeatures() {
        this.isLoading = true;

        this.subs.add(this.featureService.getAll().subscribe({
            next: (data: any) => {
                this.isLoading = false;
                this.features = data;
            },
            error: error => {
                this.isLoading = false;
                this.showSnackBar(error.error.detail);
            }
        }))
    }

    fetchAllIssues() {
        this.isLoading = true;

        this.subs.add(this.issueService.getAll().subscribe({
            next: (data: any) => {
                this.isLoading = false;
                this.dataSource.data = data;
            },
            error: error => {
                this.isLoading = false;
                this.showSnackBar(error.error.detail);
            }
        }))
    }

    openFeatureDialog(edit: boolean, issue?: any) {
        const dialogRef = this.dialog.open(IssueDialogComponent, {
            data: { edit, issue },
            disableClose: true
        });

        this.subs.add(dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.fetchAllIssues();
        }));
    }

    deleteFeature(id: string) {
        const swal = Swal.fire({
            title: 'Delete Feature',
            text: 'Are you sure want to delete this feature?',
            icon: 'warning',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#f44336',
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: 'Cancel'
        })

        swal.then(({ isConfirmed }) => {
            if (!isConfirmed) return;

            this.isLoading = true;
            this.subs.add(this.issueService.delete(id).subscribe({
                next: data => {
                    this.isLoading = false;
                    this.fetchAllIssues();
                },
                error: error => {
                    this.isLoading = false;
                    this.showSnackBar(error.error.detail);
                }
            }))
        });
    }

    showSnackBar(message: string) {
        const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
        const verticalPosition: MatSnackBarVerticalPosition = 'top';

        this.snackBar.open(message, 'close', {
            horizontalPosition, verticalPosition
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}

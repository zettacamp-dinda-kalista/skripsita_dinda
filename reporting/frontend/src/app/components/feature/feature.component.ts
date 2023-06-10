import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FeatureService } from 'src/app/services/feature.service';
import { FeatureDialogComponent } from './feature-dialog/feature-dialog.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent {
    subs = new Subscription();

    dataSource = new MatTableDataSource<any[]>([]);
    displayedColumns: string[] = ['name', 'action'];

    isLoading: boolean = false;

    constructor(
        private featureService: FeatureService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        this.fetchAllFeatures();
    }

    fetchAllFeatures() {
        this.isLoading = true;

        this.subs.add(this.featureService.getAll().subscribe({
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

    openFeatureDialog(edit: boolean, feature?: any) {
        const dialogRef = this.dialog.open(FeatureDialogComponent, {
            data: { edit, feature },
            disableClose: true
        });

        this.subs.add(dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.fetchAllFeatures();
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
            this.subs.add(this.featureService.delete(id).subscribe({
                next: data => {
                    this.isLoading = false;
                    this.fetchAllFeatures();
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

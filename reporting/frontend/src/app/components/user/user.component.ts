import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
    subs = new Subscription();

    dataSource = new MatTableDataSource<any[]>([]);
    displayedColumns: string[] = ['first_name', 'last_name', 'email', 'role', 'action'];

    isLoading: boolean = false;

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        this.fetchAllUsers();
    }

    fetchAllUsers() {
        this.isLoading = true;

        this.subs.add(this.userService.getAll().subscribe({
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

    openUserDialog(edit: boolean, user?: any) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            data: { edit, user },
            disableClose: true
        });

        this.subs.add(dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.fetchAllUsers();
        }));
    }

    deleteUser(id: string) {
        const swal = Swal.fire({
            title: 'Delete User',
            text: 'Are you sure want to delete this user?',
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
            this.subs.add(this.userService.delete(id).subscribe({
                next: data => {
                    this.isLoading = false;
                    this.fetchAllUsers();
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

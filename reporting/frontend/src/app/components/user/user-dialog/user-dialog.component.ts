import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { FeatureService } from 'src/app/services/feature.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {
    subs = new Subscription();
    
    form: FormGroup = this.formBuilder.group({
        email      : ['', [Validators.required, Validators.email]],
        first_name : ['', Validators.required],
        last_name  : ['', Validators.required],
        password   : ['', [Validators.required, Validators.minLength(6)]],
        role       : ['', Validators.required],
        permission : [[]],
    });

    roles = [
        { value: 'ADMIN', key: 'Admin' },
        { value: 'FE',    key: 'Front End' },
        { value: 'BE',    key: 'Back End' },
        { value: 'QA',    key: 'Quality Assurance' },
    ];

    features: any[] = [];

    isEdit: boolean = false;
    isLoading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialog: MatDialogRef<UserDialogComponent>,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private featureService: FeatureService
    ) { }

    ngOnInit() {
        this.isEdit = this.data.edit;
        this.form.patchValue(this.data.user);

        if (this.isEdit) {
            this.form.get('password')?.removeValidators(Validators.required);
        }

        this.fetchAllFeatures();
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

    submit() {
        if (this.form.invalid) {
            Object.entries((this.form!.controls)).forEach(([_, control]) => control.markAsTouched());
            return this.form.updateValueAndValidity();
        }

        const value = this.form.value;
        const data  = this.data;

        this.isEdit ? this.updateUser(data.user._id, value) : this.createUser(value);
    }

    createUser(data: any) {
        this.isLoading = true;

        this.subs.add(this.userService.create(data).subscribe({
            next: data => {
                this.isLoading = false;
                this.dialog.close(true);
            },
            error: error => {
                this.isLoading = false;
                this.showSnackBar(error.error.detail);
            }
        }))
    }

    updateUser(id: string, data: any) {
        this.isLoading = true;

        this.subs.add(this.userService.update(id, data).subscribe({
            next: data => {
                this.isLoading = false;
                this.dialog.close(true);
            },
            error: error => {
                this.isLoading = false;
                this.showSnackBar(error.error.detail);
            }
        }))
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

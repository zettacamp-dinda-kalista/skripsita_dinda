import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeatureService } from 'src/app/services/feature.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feature-dialog',
  templateUrl: './feature-dialog.component.html',
  styleUrls: ['./feature-dialog.component.css']
})
export class FeatureDialogComponent {
    subs = new Subscription();
    
    form: FormGroup = this.formBuilder.group({
        name: ['', Validators.required]
    });

    isEdit: boolean = false;
    isLoading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialog: MatDialogRef<FeatureDialogComponent>,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private featureService: FeatureService,
    ) { }

    ngOnInit() {
        this.isEdit = this.data.edit;
        this.form.patchValue(this.data.feature);
    }

    submit() {
        if (this.form.invalid) {
            Object.entries((this.form!.controls)).forEach(([_, control]) => control.markAsTouched());
            return this.form.updateValueAndValidity();
        }

        const value = this.form.value;
        const data  = this.data;

        this.isEdit ? this.updateFeature(data.feature._id, value) : this.createFeature(value);
    }

    createFeature(data: any) {
        this.isLoading = true;

        this.subs.add(this.featureService.create(data).subscribe({
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

    updateFeature(id: string, data: any) {
        this.isLoading = true;

        this.subs.add(this.featureService.update(id, data).subscribe({
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

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { FeatureService } from 'src/app/services/feature.service';
import { IssueService } from 'src/app/services/issue.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.css']
})
export class IssueDialogComponent {
    subs = new Subscription();

    isEdit: boolean = false;
    isLoading: boolean = false;

    testers: any[] = [];
    developers: any[] = [];
    features: any[] = [];

    devTypes = [
        { value: 'FE', key: 'Front End' },
        { value: 'BE', key: 'Back End'  },
    ];

    statuses = [
        { value: 'OPEN',        key: 'Open' },
        { value: 'IN_PROGRESS', key: 'In Progress' },
        { value: 'DEV_DONE',    key: 'Dev Done' },
        { value: 'FAIL',        key: 'Fail' },
        { value: 'PASS',        key: 'Pass' },
        { value: 'NAB',         key: 'Not A Bug' },
    ];

    severities = [
        { value: 'MAJOR',        key: 'Major' },
        { value: 'MINOR',        key: 'Minor' },
        { value: 'BLOCKING',     key: 'Blocking' },
        { value: 'MODERATE',     key: 'Moderate' },
        { value: 'LOCALIZATION', key: 'Localization' }
    ];

    form: FormGroup = this.formBuilder.group({
        ref           : ['', Validators.required],
        description   : ['', Validators.required],
        severity      : ['', Validators.required],
        feature_id    : ['', Validators.required],
        reporter_id   : ['', Validators.required],
        reported_date : [new Date(), Validators.required],
        dev_type      : [''],
        due_date      : [''],
        status        : [''],
        dev_id        : [''],
        dev_eta       : [''],
        dev_actual    : [''],
        qa_id         : [''],
        qa_eta        : [''],
        qa_actual     : ['']
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialog: MatDialogRef<IssueDialogComponent>,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private featureService: FeatureService,
        private issueService: IssueService
    ) { }

    ngOnInit() {
        this.isEdit = this.data.edit;

        if (this.isEdit) {
            this.form.patchValue(this.data.issue);
        }

        this.fetchAllUsers();
        this.fetchAllFeatures();
    }

    fetchAllUsers() {
        this.isLoading = true;

        this.subs.add(this.userService.getAll().subscribe({
            next: (data: any) => {
                this.isLoading = false;
                this.developers = data.filter((item: any) => item.role == 'FE' || item.role == 'BE');
                this.testers = data.filter((item: any) => item.role == 'QA');
            },
            error: error => {
                this.isLoading = false;
                this.showSnackBar(error.error.detail);
            }
        }))
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
        // console.log(this.form.errors);
        
        // if (this.form.invalid) {
        //     Object.entries((this.form!.controls)).forEach(([_, control]) => {
        //         control.markAsTouched()
        //     });
        //     return this.form.updateValueAndValidity();
        // }

        const value = this.form.value;
        const data  = this.data;

        this.isEdit ? this.updateIssue(data.feature._id, value) : this.createIssue(value);
    }

    createIssue(data: any) {
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

    updateIssue(id: string, data: any) {
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

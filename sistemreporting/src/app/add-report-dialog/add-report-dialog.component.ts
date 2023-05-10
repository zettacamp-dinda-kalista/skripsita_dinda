import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevTypeService } from '../services/dev-type.service';

@Component({
      selector: 'app-add-report-dialog',
      templateUrl: './add-report-dialog.component.html',
      styleUrls: ['./add-report-dialog.component.css']
})
export class AddReportDialogComponent {
      severities: string[] = [
            'Blocking',
            'Major',
            'Moderate',
            'Minor',
            'Localization'
      ];

      statuses: string[] = [
            'In progress',
            'Ready to test',
            'Todo',
            'Done',
            'Pass',
            'Fail',
            'NAB'
      ];

      types: string[] = [
            'FrontEnd',
            'BackEnd'
      ];

      isLoading: boolean = false;
      isEdit: boolean = false;
      form!: FormGroup;

      constructor(
            @Inject(MAT_DIALOG_DATA) public data: any,
            public dialogRef: MatDialogRef<AddReportDialogComponent>,
            private formBuilder: FormBuilder,
            private devTypeService: DevTypeService
      ) { }

      ngOnInit() {
            this.form = this.formBuilder.group({
                  ref_id: ['', Validators.required],
                  section: ['', Validators.required],
                  reported_date: [new Date(), Validators.required],
                  due_date: ['', Validators.required],
                  severity: ['', Validators.required],
                  status: [''],
                  dev_type: [''],
                  eta: [''],
                  actual: [''],
                  bug_description: ['', Validators.required]
            });

            this.isEdit = !!this.data;
            if (this.isEdit) this.form.patchValue(this.data.form);
      }

      submit() {
            const data = {
                  form: this.form.value,
                  index: this.data?.index
            };

            this.form.disable();
            this.isLoading = true;

            if (data.form.dev_type) {
                  this.dialogRef.close(data);
            }

            else {
                  this.devTypeService.getDevType(data.form.bug_description).subscribe({
                        next: resp => {
                              data.form.dev_type = resp.dev_type;
                              this.dialogRef.close(data);
                        },
                        error: err => {
                              this.dialogRef.close(false);
                              alert(err.message);
                        }
                  });
            }
      }
}

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    subs = new Subscription();

    isPasswordVisible: boolean = false;
    isWaitingResponse: boolean = false;

    form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private authService: AuthService
    ) { }

    get emailErrorMessage(): string {
        const touched = this.form.get('email')?.touched || false;
        const { required, email } = this.form.get('email')?.errors || {};

        let message = '';

        if (required && touched) {
            message = 'This field is required!';
        }

        if (email && touched) {
            message = 'Invalid email address!';
        }

        return message;
    }

    get passErrorMessage(): string {
        const touched = this.form.get('password')?.touched || false;
        const { required } = this.form.get('password')?.errors || {};

        let message = '';

        if (required && touched) {
            message = 'This field is required!';
        }

        return message;
    }

    showSnackBar(message: string) {
        const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
        const verticalPosition: MatSnackBarVerticalPosition = 'top';

        this.snackBar.open(message, 'close', {
            horizontalPosition, verticalPosition
        });
    }

    submit() {
        this.isWaitingResponse = true;

        if (this.form.invalid) {
            Object.entries((this.form!.controls)).forEach(([_, control]) => control.markAsTouched());
            return this.form.updateValueAndValidity();
        }

        const { email, password } = this.form.value;

        this.subs.add(this.authService.login(email!, password!).subscribe({
            next: res => {
                this.isWaitingResponse = false;
            },
            error: err => {
                this.showSnackBar(err.error.detail);
                this.isWaitingResponse = false;
            }
        }));
    }
}

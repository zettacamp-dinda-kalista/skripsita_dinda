import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  isWaitingResponse: boolean = false;

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass : ['', Validators.required]
    });
  }

  get emailErrorMessage(): string {
    const control = this.form.get('email');
    const errors  = control?.errors;

    let message = '';

    if (control?.touched && errors?.['required']) {
      message = 'This field is required!';
    }

    if (control?.touched && errors?.['email']) {
      message = 'Invalid email address!';
    }

    return message;
  }

  get passErrorMessage(): string {
    const control = this.form.get('pass');
    const errors  = control?.errors;

    let message = '';

    if (control?.touched && errors?.['required']) {
      message = 'This field is required!';
    }

    return message;
  }

  submit() {
    const form = this.form;

    if (form.invalid) {
      Object.entries(form?.controls).forEach(([_, control]) => control.markAsTouched());
      return form.updateValueAndValidity();
    }

    this.isWaitingResponse = true;
    this.router.navigate(['']);
  }
}

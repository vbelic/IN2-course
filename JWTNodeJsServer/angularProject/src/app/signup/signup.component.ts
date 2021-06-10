import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupFormGroup: FormGroup;
  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupFormGroup = fb.group({
      'firstName': [''],
      'lastName': [''],
      'emailAddress': [''],
      'password': [''],
      'phoneNumber': [''],
    });

   }

  ngOnInit() {
  }

  onCreateAccount(form: FormGroup) {
    const isValid =  form.dirty && form.valid;
    const value = form.value;
    if (isValid) {
      this.authService.createAccount(value).subscribe((response) => {
        this.router.navigate(['']);
      }, (error) => {

      });
    }
  }

}

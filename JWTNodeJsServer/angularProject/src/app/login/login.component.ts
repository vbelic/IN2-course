import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // providers: []
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  constructor(fb: FormBuilder, private router: Router, private authService: AuthService ) {
    this.loginFormGroup = fb.group({
      'emailAddress': [''],
      'password'    : ['']
    });
   }

  ngOnInit() {
  }

  onLogin(form: FormGroup) {
    const isValid =  form.dirty && form.valid;
    const value = form.value;
    if (isValid) {
      const emailAddress = value.emailAddress;
      const password = value.password;
      this.authService.login(emailAddress, password).subscribe((response) => {
        this.router.navigate(['']);
      }, (error) => {

      });
      console.log('login here');
      // ajax request
    }
  }

}

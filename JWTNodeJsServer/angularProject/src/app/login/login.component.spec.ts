import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AuthService } from '../auth/auth.service';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MockAuthService, MockRouter, mockLoginErrorResponse, mockResponseObject } from './login.component.testutils';
import { Router } from '@angular/router';
import { of } from 'rxjs';


// business requirements -- BDD (Business Driven Development)
// TDD (Test Driven Development)
describe('LoginComponent', () => {
  let component: LoginComponent;
  // fixture -- setup for the component
  let fixture: ComponentFixture<LoginComponent>;



  // identify all your dependencies
  // if angular  try not to stub or mock,
  // my own services--> mock (stub) or spy
 // unit test -- testing a single unit
 // function
  beforeEach(async(() => {
    // component --> module
    const testModule = TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [ FormsModule, ReactiveFormsModule],
      providers: [
         { provide: AuthService, useClass: MockAuthService},
         { provide: Router, useClass: MockRouter },
         {provide: APP_BASE_HREF, useValue: '/'}
      ]
    });

    testModule.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // fixture = TestBed.createComponent(LoginComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();

   // const loginFixture = fixture.debugElement.query(By.directive(LoginComponent));
    // component = loginFixture.componentInstance;
  });


  afterEach(() => {
    document.body.removeChild(fixture.debugElement.nativeElement);
    fixture.destroy();

  });

  it('should create component', () => {
     expect(component).toBeTruthy();
  });

  it(' should call authservice login if form valid and dirty when onlogin is called', () => {
      const loginFomGroup = component.loginFormGroup;
      loginFomGroup.markAsDirty();
      loginFomGroup.setValue({
        emailAddress: 'test@test.com',
        password: 'test'
      });
      const authService: AuthService = TestBed.get(AuthService);
      const loginSpy = spyOn(authService, 'login');
      const loginResponseObservable = of(Object.assign( mockResponseObject));
      loginSpy.and.returnValue(loginResponseObservable);
      const router = TestBed.get(Router);
      const routerSpy = spyOn(router, 'navigate');
      component.onLogin(loginFomGroup);
      expect(loginSpy).toHaveBeenCalledWith('test@test.com', 'test');
      expect(routerSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['']);
      expect(routerSpy).not.toHaveBeenCalledWith(['/login']);
     // expect(loginSpy)
  });


  it(' should not call router navigate if authService returns error when onlogin is called', () => {
    const loginFomGroup = component.loginFormGroup;
    loginFomGroup.markAsDirty();
    loginFomGroup.setValue({
      emailAddress: 'test@test.com',
      password: 'test'
    });
    const authService: AuthService = TestBed.get(AuthService);
    const loginSpy = spyOn(authService, 'login');
    loginSpy.and.returnValue(mockLoginErrorResponse);
    const router = TestBed.get(Router);
    const routerSpy = spyOn(router, 'navigate');
    component.onLogin(loginFomGroup);
    expect(loginSpy).toHaveBeenCalledWith('test@test.com', 'test');
    expect(routerSpy).not.toHaveBeenCalled();

   // expect(loginSpy)
});
// it(' should not call  authservice if form is invald, onLogin', () => {
//   const loginFomGroup = component.loginFormGroup;
//   loginFomGroup.markAsDirty();
//   loginFomGroup.setErrors({'incorrect': true});
//   loginFomGroup.setValue({
//     emailAddress: 'test@test.com',
//     password: 'test'
//   });
//   const authService: AuthService = TestBed.get(AuthService);
//   const loginSpy = spyOn(authService, 'login');
//   loginSpy.and.returnValue(mockLoginErrorResponse);
//   const router = TestBed.get(Router);
//   const routerSpy = spyOn(router, 'navigate');
//   component.onLogin(loginFomGroup);
//   expect(loginSpy).not.toHaveBeenCalled();
//   expect(routerSpy).not.toHaveBeenCalled();

//  // expect(loginSpy)
// });



});

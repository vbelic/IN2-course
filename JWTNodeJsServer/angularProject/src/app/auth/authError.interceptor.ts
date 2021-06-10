import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor (private authService: AuthService, private router: Router) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
           .pipe(
             catchError( (err) => this.onError(err))

            );
  }

  onError(err) {
    const statusCode = err.status;
    if (statusCode === 403) {
      this.authService.logout();
      alert(' UnAuthorized Access');
      // display error to user
      this.router.navigate(['/login']);
    }
    const msg = err.error.message || err.statusText;
    return throwError(msg);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: string;
  constructor(private http: HttpClient ) {

  }

  login (emailAddress: string, password: string) {
     return this.http.post('http://localhost:9200/login', {emailAddress, password})
                .pipe(tap(res => this.setSession(res)));
  }

  createAccount (data) {
    return this.http.post('http://localhost:9200/users', data)
           .pipe(tap(res => this.setSession(res)));
  }

  getUserProfile() {
    return this.http.get('http://localhost:9200/users');
  }

  getProducts() {
    return this.http.get('http://localhost:9200/products');
  }

  setSession (response) {
    // const t = response?.expiresIn?b.
    const expiresIn = _.get(response, 'expiresIn');
    const expirationTime = moment().add(expiresIn, 'millisecond').valueOf();
    const token = _.get(response, 'token');
    const userId = _.get(response, 'userId');
    this.userId = userId;
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime',  _.toString(expirationTime));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    let expiration =  localStorage.getItem('expirationTime');
    expiration = _.toNumber(expiration);
    const expirationMoment = moment(expiration);
    return !!token && moment().isBefore(expirationMoment); // boolean !!
    // true !-- false  !-- true
    // obj --> false --- true

    // date mdn ==> 0 -- january
    // momentjs
  }
}

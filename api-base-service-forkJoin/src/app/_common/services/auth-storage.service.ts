import { Injectable } from '@angular/core';

import { AuthStorageModel } from '../models/auth-storage.model';
import { AppUserModel } from '../models/app-user.model';
import { AppUtils } from './app-utils';
import { JwtTokenModel } from '../models/jwt-token.model';
import { AppSettingsModel } from '../models/app-settings.model';

@Injectable({
    providedIn: 'root',
})
export class AuthStorageService {
    private static jwtStorageName = "jwt3";
    public static defaultLocale = "en";
    private _user: AppUserModel = null;
    private _authToken: string;
    private _settings: AppSettingsModel;

    // TODO: (dm) move to settings
    private _locale = null;

    constructor() {
    }

    public get bearerAuthorization(): string {
        if (!this._authToken) {
            this.readAuthData();
        }

        return "Bearer " + this._authToken;
    }

    public get isAuthTokenValid(): boolean {
        if (!this._authToken) {
            this.readAuthData();
        }

        if (this._authToken) {
            return !this.isTokenExpired();
        }

        return false;
    }

    public get user(): AppUserModel {
        if (!this._user) {
            this.readAuthData();
        }

        return this._user;
    }

    // TODO: (dm) move to settings
    public get locale(): string {
        if (!this._locale) {
            this.readAuthData();

            if (!this._locale) {
                this._locale = AuthStorageService.defaultLocale;
            }
        }

        return this._locale;
    }

    public set locale(l: string) {
        if (!this._locale) {
        }

        this._locale = l || AuthStorageService.defaultLocale;
    }

    public get settings(): AppSettingsModel {
        if (!this._settings) {
            // TODO: (dm) load settings
            this._settings = new AppSettingsModel();
        }

        return this._settings;
    }

    private readAuthData() {
        const token = localStorage.getItem(AuthStorageService.jwtStorageName);

        if (token) {
            try {
                const jwt: AuthStorageModel = JSON.parse(token);
                this.setAuthData(jwt);
            } catch {
                this.__removeFromStorage();
            }
        }
    }

    private setAuthData(jwt: AuthStorageModel) {
        if (jwt) {
            this._user = new AppUserModel(jwt.userName, jwt.firstName, jwt.lastName, jwt.displayName);
            this._authToken = jwt.authToken ? jwt.authToken : null;
            this._locale = jwt.locale || AuthStorageService.defaultLocale;
        } else {
            this._user = null;
            this._authToken = null;
            this._locale = AuthStorageService.defaultLocale;
        }
    }

    private decodeToken(): JwtTokenModel {
        if (!this._authToken) {
            return null;
        }

        const t = this._authToken.split('.');

        if (t.length !== 3) {
            throw new Error('Invalid JWT token.');
        }

        const decoded = AppUtils.urlBase64Decode(t[1]);

        if (!decoded) {
            throw new Error('Cannot decode the token.');
        }

        return JSON.parse(decoded);
    }

    private getTokenExpirationDate(): Date {
        const t = this.decodeToken();

        if (!t.hasOwnProperty('exp')) {
            return null;
        }

        const date = new Date(0);

        date.setUTCSeconds(t.exp);

        return date;
    }

    private isTokenExpired(offsetSeconds: number = 0) {
        const date = this.getTokenExpirationDate();

        offsetSeconds = offsetSeconds || 0;

        if (date === null) {
            return true;
        }

        return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
    }

    /*
    * internal method
    */
    public __saveToStorage(jwt: AuthStorageModel) {
        if (jwt) {
            localStorage.setItem(AuthStorageService.jwtStorageName, JSON.stringify(jwt));
            this.setAuthData(jwt);
        } else {
            this.__removeFromStorage();
        }
    }

    /*
    * internal method
    */
    public __removeFromStorage() {
        localStorage.removeItem(AuthStorageService.jwtStorageName);
        this.setAuthData(null);
    }
}

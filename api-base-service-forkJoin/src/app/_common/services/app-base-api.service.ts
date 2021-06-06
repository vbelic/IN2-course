import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from './app-error';
import { AppUtils } from './app-utils';
//// import { __DxBaseDataStore } from './dx-base-data-store';
import { AuthStorageService } from './auth-storage.service';

/**
 * AppBaseApiService params (eq. query string & http headers)
 */
export class AppBaseApiServiceParams {
    [param: string]: string
}

export class AppBaseApiSortingInfo {
    selector: string = null;
    desc = false;
}

export class AppBaseApiLoadOptions {
    filter: Array<string | Array<string>> = null;
    sort: Array<AppBaseApiSortingInfo> = null;
    group: Array<AppBaseApiSortingInfo> = null;
    skip = 0;
    take = 10;
}

/**
 * Application base api service
 */
@Injectable()
export class AppBaseApiService {

    /**
     * Initializes a new instance of the AppBaseApiService class
     * @param httpClient Http client
     */
    constructor (
        private httpClient: HttpClient,
        private authService: AuthStorageService) {
    }

    private CreateDefaultHeaders(h?: AppBaseApiServiceParams): HttpHeaders {
        let headers = new HttpHeaders();

        // append, not set!
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');

        // TODO: (dm), Net Core > 3, swap Accept-Language with Content-Language (depends on changes in base service, startup.cs)
        headers = headers.append('Accept-Language', this.authService.locale);

        if (this.authService.isAuthTokenValid) {
            headers = headers.append('Authorization', this.authService.bearerAuthorization);
        } /*else {
            throw new Error("Unauthorized. Please try login in again.");
        }*/

        if (h) {
            Object.keys(h).forEach((key) => {
                const o = h[key];

                if (!key) {
                    throw new Error('"key" cannot be null.');
                }

                if (o) {
                    // set, not append!
                    headers = headers.set(key, o);
                } else {
                    headers = headers.delete(key);
                }
            });
        }

        return headers;
    }

    private HandleError(error: HttpErrorResponse) {
        const e = new AppError();

        // log errors
        if (error.error instanceof ErrorEvent) {
            e.status = error.status;
            e.message = error.error.message;

            console.error('AppBaseApiService: An error occurred:', error.error.message);
        } else {
            e.status = error.status;
            e.message = error.message;
            e.value = error.error;

            console.error(
                `AppBaseApiService: Backend returned code: ${error.status}, message: ${error.message}`
                + ` body: ${JSON.stringify(error.error)}`);
        }

        // forward error
        return throwError(e);
    }

    private ObjToParam(obj: any): string {
        let value: string = null;

        if (obj instanceof Date) {
            value = AppUtils.SerializeDate(obj);
        } else {
            value = obj.toString();
        }

        return value;
    }

    // ------------------------------------------------------------------------------------------------
    //
    // do not modify, fragile!
    //
    private AddParamToHttpParams(params: HttpParams, obj: Object, parent: string): HttpParams {
        if (AppUtils.IsObject(obj) && Object.keys(obj).length !== 0) {
            Object.keys(obj).forEach((key) => {
                const o = obj[key];

                if (AppUtils.IsArray(o)) {
                    if ((o as Array<object>).length > 0) {
                        const arr = o as Array<object>;

                        for (let i = 0; i < arr.length; i++) {
                            params = this.AddParamToHttpParams(
                                params,
                                arr[i], parent === ""
                                    ? `${key}[${i}]`
                                    : `${parent}.${key}[${i}]`);
                        }
                    }
                    /* {
                    none, omit empty arrays
                    } */
                } else if (AppUtils.IsObject(o)) {
                    params = this.AddParamToHttpParams(params, o, parent === "" ? key : `${parent}.${key}`);
                } else if (o) {
                    // set, not append
                    params = params.set(parent === "" ? key : `${parent}.${key}`, this.ObjToParam(o));
                }
                /* {
                     none, omit null objects
                } */
            });
        } else {
            if (obj) {
                if (parent === "") {
                    throw new Error('"parent" cannot be null.');
                }

                // append, not set!
                params = params.append(parent, this.ObjToParam(obj));
            }
            /* {
                none, omit null values
            } */
        }

        return params;
    }
    // ------------------------------------------------------------------------------------------------

    /**
     * Construct a GET request which interprets the body as JSON and returns it.
     * @param url Api url
     * @param queryParams query params (optional)
     * @param httpHeaders http headers (optional)
     */
    public Get<TModel>(
        url: string,
        queryParams?: AppBaseApiServiceParams | AppBaseApiLoadOptions | object,
        httpHeaders?: AppBaseApiServiceParams,
        responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' ): Observable<TModel> {

        if (!url) {
            throw Error('"url" cannot be null or empty!');
        }

        const headers: HttpHeaders = this.CreateDefaultHeaders(httpHeaders);

        let params: HttpParams = null;

        if (queryParams) {
            if (queryParams instanceof AppBaseApiLoadOptions) {
                //// params = this.AddParamToHttpParams(new HttpParams(), __DxBaseDataStore.LoadOptionsToActionParams(queryParams, false), "");
            } else {
                params = this.AddParamToHttpParams(new HttpParams(), queryParams, "");
            }
        }

        if (!responseType) {
            return this.httpClient.get<TModel>(url, { headers: headers, params: params })
                .pipe(
                    catchError(this.HandleError)
                );
        }

        const options = { headers: headers, params: params, responseType: responseType };

        return this.httpClient.get(url, options as any)
            .pipe(
                catchError(this.HandleError)
            ) as any;
    }

    /**
     * Construct a POST request which interprets the body as JSON and returns it.
     * @param url Api url
     * @param data data to send
     * @param queryParams query params (optional)
     * @param httpHeaders http headers (optional)
     */
    public Post<TModel>(
        url: string,
        data: object,
        queryParams?: AppBaseApiServiceParams | object,
        httpHeaders?: AppBaseApiServiceParams): Observable<TModel> {

        if (!url) {
            throw Error('"url" cannot be null or empty!');
        }

        const params: HttpParams = queryParams ? this.AddParamToHttpParams(new HttpParams(), queryParams, "") : null;
        const headers: HttpHeaders = this.CreateDefaultHeaders(httpHeaders);

        return this.httpClient.post<TModel>(url, data, { headers: headers, params: params })
            .pipe(
                catchError(this.HandleError)
            );
    }

    /**
     * Construct a PUT request which interprets the body as JSON and returns it.
     * @param url Api url
     * @param data data to send
     * @param httpHeaders http headers (optional)
     */
    public Put<TModel>(
        url: string,
        id: number,
        data: object,
        httpHeaders?: AppBaseApiServiceParams,
        queryParams?: AppBaseApiServiceParams | object): Observable<TModel> {

        if (!url) {
            throw Error('"url" cannot be null or empty!');
        }

        const headers: HttpHeaders = this.CreateDefaultHeaders(httpHeaders);
        let params: HttpParams;

        if (id) {
            params = this.AddParamToHttpParams(new HttpParams(), id, "id");
        } else {
            params = new HttpParams();
        }

        if (queryParams) {
            params = this.AddParamToHttpParams(params, queryParams, "");
        }

        return this.httpClient.put<TModel>(url, data, { headers: headers, params: params })
            .pipe(
                catchError(this.HandleError)
            );
    }

    /**
     * Construct a DELETE request which interprets the body as JSON and returns it.
     * @param url Api url
     * @param id object identifier
     * @param httpHeaders http headers (optional)
     */
    public Delete<TModel>(
        url: string,
        id: number,
        httpHeaders?: AppBaseApiServiceParams,
        queryParams?: AppBaseApiServiceParams | object): Observable<TModel> {

        if (!url) {
            throw Error('"url" cannot be null or empty!');
        }

        const headers: HttpHeaders = this.CreateDefaultHeaders(httpHeaders);
        let params: HttpParams = this.AddParamToHttpParams(new HttpParams(), id, "id");

        if (queryParams) {
            params = this.AddParamToHttpParams(params, queryParams, "");
        }

        return this.httpClient.delete<TModel>(url, { headers: headers, params: params })
            .pipe(
                catchError(this.HandleError)
            );
    }
}

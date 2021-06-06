import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "./app-config.service";
import { AppBaseApiLoadOptions, AppBaseApiService, AppBaseApiServiceParams } from "./_common/services/app-base-api.service";

@Injectable()
export class AppService {
    constructor (
        private apiService: AppBaseApiService,
        private config: AppConfigService) {
    }

    /**
     * Returns people by identity number
     * @param id people identity number
     */
    public getPeopleById(id: number): Observable<any> {
        return this.apiService.Get<any>(`${this.config.peopleUrl}/${id}/`);
    }

    /**
     * Returns people by identity number
     * @param id people identity number
     */
    public getPlanetsById(id: number): Observable<any> {
            return this.apiService.Get<any>(`${this.config.planetsUrl}/${id}/`);
    }

    /**
     * Returns list of lookups for Dx auto complete control
     * @param filter lookups filter
     */
    public getLookupsForAutocomplete(
            filter: object | AppBaseApiServiceParams | AppBaseApiLoadOptions): Observable<Array<any>> {
        return this.apiService.Get<Array<any>>(this.config.lookupUrl, filter);
        }

    /**
     * Changes people type
     * @param peopleId People identifier
     * @param peopleTypeId People type identifier
     */
    public changePeopleType(peopleId: number, peopleTypeId: number)
            : Observable<boolean> {
        return this.apiService.Post<boolean>(this.config.peopleUrl, {peopleId, peopleTypeId});
    }
}

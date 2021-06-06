import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable()
export class AppConfigService {
    // environment settings
    private scheme = environment.swapiScheme;
    private host: string = environment.swapiHost;
    private port: string = environment.swapiPort;
    private version: string = environment.swapiVersion;

    // base urls
    // https://swapi.dev/api/people/1/
    // https://swapi.dev/api/planets/1/

    private baseUrl = `${this.scheme}${this.host}/api`;
    private lookupBaseUrl = this.baseUrl + "/lookup";

    /**
     * Lookup api url
     */
    public readonly lookupUrl: string = this.lookupBaseUrl;

    /**
     * People api url
     */
    public readonly peopleUrl = this.baseUrl + "/people";

    /**
     * Planets api url
     */
    public readonly planetsUrl = this.baseUrl + "/planets";
}

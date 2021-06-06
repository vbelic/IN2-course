import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

export interface AppCanComponentDeactivate {
    canDeactivate: (currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot)
        => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class AppEditGuard implements CanDeactivate<AppCanComponentDeactivate> {
    canDeactivate(
            component: AppCanComponentDeactivate,
            currentRoute: ActivatedRouteSnapshot,
            currentState: RouterStateSnapshot,
            nextState?: RouterStateSnapshot) {
        return component.canDeactivate ? component.canDeactivate(currentRoute, currentState, nextState) : true;
    }
}

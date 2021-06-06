import { Injectable, OnDestroy } from "@angular/core";
import { forkJoin, Subject, Observable, Subscriber, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { AppEditModel } from "./app-edit.model";
import { AppService } from "./app.service";
import { AppData } from "./_common/models/app-data.model";
import { IdNameMnemonicModel } from "./_common/models/id-name-mnemonic.model";


export class AppGlobalLookups {
    public currencies: Array<IdNameMnemonicModel>;
    public genders: Array<IdNameMnemonicModel>;
}

@Injectable()
export class AppDataStoreService implements OnDestroy {

    private _data: AppEditModel = new AppEditModel();
    private _lookups: AppGlobalLookups = new AppGlobalLookups();

    private _onDataLoadComplete: ReplaySubject<AppEditModel> = new ReplaySubject();
    private _onLookupsLoaded: Observable<AppGlobalLookups>;
    private destroyed$: Subject<boolean> = new Subject();

    private areLookupsInitialized = false;
    private areLookupsLoaded = false;
    private dataSnapshot: string = null;

    public get onDataLoadComplete(): Subject<AppEditModel> {
        return this._onDataLoadComplete;
    }

    public get onLookupsLoaded(): Observable<AppGlobalLookups> {
        return this._onLookupsLoaded;
    }

    public get data(): AppEditModel {
        return this._data;
    }

    public get lookups(): AppGlobalLookups {
        return this._lookups;
    }

    public get isDataChanged(): boolean {
        return this.dataSnapshot && (this.dataSnapshot !== JSON.stringify(this.data));
    }

    constructor(
        private appService: AppService,
    ) {
        this._onLookupsLoaded = new Observable(s => {
            if (!this.areLookupsInitialized) {
                this.loadLookups(s);
            } else {
                const wait = () => {
                    if (this.areLookupsLoaded) {
                        s.next(this.lookups);
                        s.complete();
                    } else {
                        setTimeout(wait, 25);
                    }
                };

                wait();
            }

            return { unsubscribe() {} };
        });

        this._onLookupsLoaded
            .pipe(takeUntil(this.destroyed$))
            .subscribe(l => console.log("App lookups are loaded."));
    }

    private loadLookups(s: Subscriber<AppGlobalLookups>) {
        if (this.areLookupsInitialized) {
            console.log("Lookups already loaded");
            return;
        }

        this.areLookupsInitialized = true;


        const appLookups = this.appService.getLookupsForAutocomplete({ filter: ''});

        return forkJoin(appLookups)
            .pipe(take(1))
            .subscribe(lookups => {
                this.lookups.currencies = lookups[0]['currencies'];
                this.lookups.genders = lookups[0]['genders'];

                this.areLookupsLoaded = true;

                s.next(this._lookups);
                s.complete();
            });
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public clear() {
        this.data.clear();
        this.dataSnapshot = null;
        this._onDataLoadComplete = new ReplaySubject();
    }

    public takeSnapshot() {
        this.dataSnapshot = JSON.stringify(this.data);
    }

    public lookup<T extends IdNameMnemonicModel[]>(name: keyof AppGlobalLookups): Observable<T> {
        return new Observable((o) => {
            this._onLookupsLoaded
                .pipe(take(1))
                .subscribe(l => {
                    o.next(l[name] as T);

                    o.complete();

                    return { unsubscribe() { o.unsubscribe(); } };
                });
        });
    }
}
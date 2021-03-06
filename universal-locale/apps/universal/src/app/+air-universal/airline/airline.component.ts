import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@fulls1z3/shared/store';
import { Airline, airlineActions, AirlineSelectors } from '@fulls1z3/shared/store-air-universal';
import { LanguageSelectors } from '@fulls1z3/shared/store-i18n';
import { routeAnimation } from '@fulls1z3/shared/ui-base';
import { BaseContainerComponent } from '@fulls1z3/shared/ui-store';
import { I18NService, Language } from '@fulls1z3/shared/util-i18n';
import { select, Store } from '@ngrx/store';
import { from as observableFrom, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './airline.component.html',
  animations: [routeAnimation]
})
export class AirlineComponent extends BaseContainerComponent implements OnInit {
  readonly filter$ = new Subject<string>();
  private readonly _baseRoute = ['/', 'air-universal', 'airlines'];
  public languageCode: string = '';

  get error$(): Observable<string> {
    return this.store$.pipe(select(AirlineSelectors.getError));
  };

  get isProcessing$(): Observable<boolean> {
    return this.store$.pipe(select(AirlineSelectors.getIsProcessing));
  };

  get airlines$(): Observable<Array<Airline>> {
    return this.store$.pipe(select(AirlineSelectors.getMany))
  };

  constructor(private readonly router: Router, protected readonly store$: Store<State>) {
    super(store$);
  }

  ngOnInit(): void {
    this.store$.pipe(select(LanguageSelectors.getWorkingLanguage)).pipe(take(1)).subscribe(value => {
      this.languageCode = value.code;
    });
    this.store$.dispatch(airlineActions.airUniversalGetManyAirlines()); 
  }

  createClick(): void {
    observableFrom(this.router.navigate([...this._baseRoute, 'create']))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
      });
  }

  filterChange(value: string): void {
    this.filter$.next(value);
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Airline } from '@fulls1z3/shared/store-air-universal';
import { BaseComponent } from '@fulls1z3/shared/ui-base';
import { flow, get } from 'lodash/fp';
import hr from '@angular/common/locales/hr';
import tr from '@angular/common/locales/tr';
import en from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'fs-airline-table',
  templateUrl: './airline-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirlineTableComponent extends BaseComponent implements OnChanges, OnInit {
  @ViewChild(MatPaginator, { static: true }) readonly paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) readonly sort: MatSort;
  @Input() readonly data: Array<Airline>;
  @Input() readonly filter: string;
  @Input() readonly languageCode: string;

  dataSource: MatTableDataSource<Airline>;

  get displayedColumns(): Array<string> {
    return ['id', 'iataCode', 'name', 'price', 'actions'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isFilterChanged = flow(
      cur => [
        get('filter.previousValue')(cur),
        get('filter.currentValue')(cur)
      ],
      ([a, b]) => a !== b
    )(changes);

    // tslint:disable-next-line:strict-boolean-expressions
    if (this.dataSource && isFilterChanged) {
      this.dataSource.filter = this.filter;
    }
  }

  ngOnInit(): void {
    switch (this.languageCode) {
      case 'hr':
        registerLocaleData(hr);
        break;
      case 'tr':
        registerLocaleData(tr);
        break;
      default:
        registerLocaleData(en);
        break;
    }
    
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
}

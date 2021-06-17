import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { CustomizeService, Employee } from '../../shared/services/customize.service';

@Component({
  templateUrl: 'customize.component.html',
  styleUrls: [ './customize.component.scss' ],
  providers: [ CustomizeService ],
})

export class CustomizeComponent implements AfterViewInit {
    @ViewChild(DxFormComponent, { static: false }) myform: DxFormComponent;
    employee: Employee;
    positions: string[];
    rules: Object;

  constructor(service: CustomizeService) {
    this.employee = service.getEmployee();
    this.positions = service.getPositions();
    this.rules = { 'X': /[02-9]/ };
  }

  ngAfterViewInit() {
    this.myform.instance.validate()
  }
}

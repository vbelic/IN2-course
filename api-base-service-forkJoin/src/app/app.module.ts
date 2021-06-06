import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppBaseApiService } from './_common/services/app-base-api.service';
import { AppConfigService } from './app-config.service';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppBaseApiService, AppConfigService, AppService]
})
export class AppModule { }

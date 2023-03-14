import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {API_KEY, GoogleSheetsDbService} from 'ng-google-sheets-db'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArchetypeComponent } from './archetype/archetype.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ArchetypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{
    provide: API_KEY,
    useValue: "AIzaSyByA4ztVKLlcRdVgtoroqy1ltLoX8uGNxU"
  },
  GoogleSheetsDbService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabelaComponent } from './pages/tabela/tabela.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { FilterTablePipe } from './pipes/filter-table.pipe';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
registerLocaleData(localePt);
@NgModule({
	declarations: [
		AppComponent,
		TabelaComponent,
		FilterTablePipe,
		DashboardComponent,
		ClienteComponent
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		ChartModule,
		MatPaginatorModule,
		BrowserAnimationsModule

	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'pt' },
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting] }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

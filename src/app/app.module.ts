import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabelaComponent } from './pages/tabela/tabela.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { FilterTablePipe } from './pipes/filter-table.pipe';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { CadastroClienteComponent } from './pages/cadastro-cliente/cadastro-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './dialogs/message/message.component';
import { CadastroEstoqueComponent } from './pages/cadastro-estoque/cadastro-estoque.component';
import { CadastroServicosComponent } from './pages/cadastro-servicos/cadastro-servicos.component';

registerLocaleData(localePt);
@NgModule({
	declarations: [
		AppComponent,
		TabelaComponent,
		FilterTablePipe,
		DashboardComponent,
		ClienteComponent,
		CadastroClienteComponent,
		MessageComponent,
		CadastroEstoqueComponent,
		CadastroServicosComponent
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		FormsModule,
		NgbModule,
		ChartModule,
		MatPaginatorModule,
		BrowserAnimationsModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatDialogModule

	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'pt' },
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting] }
	],
	bootstrap: [AppComponent],
	entryComponents: [MessageComponent]
})
export class AppModule { }

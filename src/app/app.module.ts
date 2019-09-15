// Core
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { CadastroModule } from './pages/cadastro/cadastro.module';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Angular bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';
import { CadastroVendaComponent } from './pages/cadastro-venda/cadastro-venda.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { DashboardFinanceiroComponent } from './pages/dashboard-financeiro/dashboard-financeiro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FinanceiroComponent } from './pages/financeiro/financeiro.component';
import { MessageComponent } from './core/dialogs/message/message.component';
import { MainComponent } from './main/main.component';
import { OrcamentoComponent } from './core/dialogs/orcamento/orcamento.component';
import { PagamentosComponent } from './pages/pagamentos/pagamentos.component';
import { TabelaComponent } from './pages/tabela/tabela.component';
import { VendasComponent } from './pages/vendas/vendas.component';

// Plugins
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import {
	CalendarDateFormatter,
	CalendarModule,
	CalendarMomentDateFormatter,
	DateAdapter,
	MOMENT
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';

// Pipe
import { FilterTablePipe } from './shared/pipes/filter-table.pipe';


export function momentAdapterFactory() {
	return adapterFactory(moment);
}

registerLocaleData(localePt);
@NgModule({
	declarations: [
		AppComponent,
		TabelaComponent,
		FilterTablePipe,
		DashboardComponent,
		ClienteComponent,
		MessageComponent,
		VendasComponent,
		CadastroVendaComponent,
		OrcamentoComponent,		
		PagamentosComponent,
		FinanceiroComponent,
		DashboardFinanceiroComponent,
		MainComponent
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
		MatDialogModule,
		MatDividerModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatFormFieldModule,
		MatInputModule,
		CadastroModule,
		CalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: momentAdapterFactory
			},
			{
				dateFormatter: {
					provide: CalendarDateFormatter,
					useClass: CalendarMomentDateFormatter
				}
			}
		)
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'pt' },
		{ provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting] },
		{ provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
		{ provide: MOMENT, useValue: moment }
	],
	bootstrap: [AppComponent],
	entryComponents: [
		MessageComponent,
		OrcamentoComponent,
		PagamentosComponent,
		CadastroVendaComponent
	]

})
export class AppModule { }

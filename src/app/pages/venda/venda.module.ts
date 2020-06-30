import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaRoutingModule } from './venda-routing.module';

import { VendasComponent } from './vendas/vendas.component';
import { CadastroVendaComponent } from './cadastro-venda/cadastro-venda.component';
import { PagamentosComponent } from './pagamentos/pagamentos.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
	declarations: [
		VendasComponent,
		CadastroVendaComponent,
		PagamentosComponent
	],
	imports: [
		CommonModule,
		VendaRoutingModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		MatDividerModule,
		MatDatepickerModule
	],
	entryComponents: [
		CadastroVendaComponent,
		PagamentosComponent
	]
})
export class VendaModule { }

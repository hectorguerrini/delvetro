import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendaRoutingModule } from './venda-routing.module';
import { VendasComponent } from './vendas/vendas.component';
import { CadastroVendaComponent } from './cadastro-venda/cadastro-venda.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		VendasComponent,
		CadastroVendaComponent
	],
	imports: [
		CommonModule,
		VendaRoutingModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule
	],
	entryComponents: [
		CadastroVendaComponent
	]
})
export class VendaModule { }

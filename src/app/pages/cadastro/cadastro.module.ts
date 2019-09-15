import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { CadastroRoutingModule } from './cadastro-routing.module';

import { CadastroEstoqueComponent } from './cadastro-estoque/cadastro-estoque.component';
import { CadastroProdutosComponent } from './cadastro-produtos/cadastro-produtos.component';
import { CadastroServicosComponent } from './cadastro-servicos/cadastro-servicos.component';
import { CadastroClienteComponent } from './cadastro-cliente/cadastro-cliente.component';
import { CadastroBeneficiadosComponent } from './cadastro-beneficiados/cadastro-beneficiados.component';

@NgModule({
	declarations: [
		CadastroClienteComponent,
		CadastroEstoqueComponent,
		CadastroServicosComponent,
		CadastroProdutosComponent,
		CadastroBeneficiadosComponent
	],
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		CadastroRoutingModule
	],
	entryComponents: [
		CadastroClienteComponent
	]
})
export class CadastroModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroClienteComponent } from './cadastro-cliente/cadastro-cliente.component';
import { CadastroEstoqueComponent } from './cadastro-estoque/cadastro-estoque.component';
import { CadastroServicosComponent } from './cadastro-servicos/cadastro-servicos.component';
import { CadastroProdutosComponent } from './cadastro-produtos/cadastro-produtos.component';
import { CadastroBeneficiadosComponent } from './cadastro-beneficiados/cadastro-beneficiados.component';

const routes: Routes = [
	{ path: 'cliente', component: CadastroClienteComponent },
	{ path: 'estoque', component: CadastroEstoqueComponent },
	{ path: 'servicos', component: CadastroServicosComponent },
	{ path: 'produtos', component: CadastroProdutosComponent },
	{ path: 'beneficiados', component: CadastroBeneficiadosComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CadastroRoutingModule { }

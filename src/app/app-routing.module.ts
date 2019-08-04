import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { CadastroClienteComponent } from './pages/cadastro-cliente/cadastro-cliente.component';
import { CadastroEstoqueComponent } from './pages/cadastro-estoque/cadastro-estoque.component';
import { CadastroServicosComponent } from './pages/cadastro-servicos/cadastro-servicos.component';
import { CadastroProdutosComponent } from './pages/cadastro-produtos/cadastro-produtos.component';
import { VendasComponent } from './pages/vendas/vendas.component';
import { CadastroBeneficiadosComponent } from './pages/cadastro-beneficiados/cadastro-beneficiados.component';
const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'cliente', component: ClienteComponent},
	{ path: 'cliente/:id', component: ClienteComponent},
	{ path: 'cadastro/cliente', component: CadastroClienteComponent},
	{ path: 'cadastro/estoque', component: CadastroEstoqueComponent},
	{ path: 'cadastro/servicos', component: CadastroServicosComponent},
	{ path: 'cadastro/produtos', component: CadastroProdutosComponent},
	{ path: 'cadastro/beneficiados', component: CadastroBeneficiadosComponent},
	{ path: 'vendas', component: VendasComponent},
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

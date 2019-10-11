// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { VendasComponent } from './pages/vendas/vendas.component';
import { FinanceiroComponent } from './pages/financeiro/financeiro.component';
import { DashboardFinanceiroComponent } from './pages/dashboard-financeiro/dashboard-financeiro.component';

const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'cliente', component: ClienteComponent},
	{ path: 'cliente/:id', component: ClienteComponent},
	{
		path: 'cadastro',
		loadChildren: () => import('./pages/cadastro/cadastro.module').then(mod => mod.CadastroModule)
	},
	{ path: 'vendas', component: VendasComponent},
	{ path: 'financeiro', component: FinanceiroComponent},
	{ path: 'financeiro/calendario', component: DashboardFinanceiroComponent},
	{ path: '**', redirectTo: '/vendas', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

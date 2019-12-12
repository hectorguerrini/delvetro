// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { FinanceiroComponent } from './pages/financeiro/financeiro.component';
import { DashboardFinanceiroComponent } from './pages/dashboard-financeiro/dashboard-financeiro.component';
import { LoginComponent } from './login/login.component';
import { PublicGuard, ProtectedGuard } from 'ngx-auth';


const routes: Routes = [
	{ path: 'dashboard', canActivate: [ProtectedGuard], component: DashboardComponent },
	{ path: 'cliente', canActivate: [ProtectedGuard], component: ClienteComponent },
	{ path: 'cliente/:id', canActivate: [ProtectedGuard], component: ClienteComponent },
	{
		path: 'cadastro',
		canActivate: [ ProtectedGuard ], 
		loadChildren: () => import('./pages/cadastro/cadastro.module').then(mod => mod.CadastroModule)
	},
	{
		path: 'venda',
		canActivate: [ ProtectedGuard ],
		loadChildren: () => import('./pages/venda/venda.module').then(mod => mod.VendaModule)
	},
	{ path: 'financeiro', canActivate: [ ProtectedGuard ], component: FinanceiroComponent },
	{ path: 'financeiro/calendario', canActivate: [ ProtectedGuard ], component: DashboardFinanceiroComponent},	
	{
		path: 'relatorio',
		canActivate: [ ProtectedGuard ],
		loadChildren: () => import('./pages/relatorio/relatorio.module').then(mod => mod.RelatorioModule)
	},
	{ path: 'login', canActivate: [ PublicGuard ], component: LoginComponent},
	{ path: '**', redirectTo: '/venda', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

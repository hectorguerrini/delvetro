import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { CadastroClienteComponent } from './pages/cadastro-cliente/cadastro-cliente.component';
const routes: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'cliente', component: ClienteComponent},
	{ path: 'cliente/:id', component: ClienteComponent},
	{ path: 'cadastro/cliente', component: CadastroClienteComponent},
	{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

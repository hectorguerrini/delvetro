import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabelaComponent } from './pages/tabela/tabela.component';
const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: TabelaComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }

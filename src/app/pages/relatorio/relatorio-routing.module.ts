import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItensComponent } from './itens/itens.component';
import { EstoqueComponent } from './estoque/estoque.component';

const routes: Routes = [
	{ path: 'itens', component: ItensComponent },
	{ path: 'estoque', component: EstoqueComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RelatorioRoutingModule { }

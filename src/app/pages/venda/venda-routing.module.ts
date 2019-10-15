import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendasComponent } from './vendas/vendas.component';

const routes: Routes = [
	{ path: '', component: VendasComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VendaRoutingModule { }

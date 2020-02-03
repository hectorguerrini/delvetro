import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioRoutingModule } from './relatorio-routing.module';
import { ItensComponent } from './itens/itens.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EstoqueComponent } from './estoque/estoque.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
	declarations: [ItensComponent, EstoqueComponent],
	imports: [
		CommonModule,
		RelatorioRoutingModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatSelectModule
	]
})
export class RelatorioModule { }

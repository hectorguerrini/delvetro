import { Component, OnInit } from '@angular/core';
import { RelatorioService } from '../relatorio.service';
import { AppService } from 'src/app/core/services/app.service';
import { Paginacao } from 'src/app/shared/models/paginacao';
import { PageEvent } from '@angular/material/paginator';
import { filtroEstoque } from 'src/app/shared/models/tabela';
import { ControleEstoque } from 'src/app/shared/models/estoque';
import { Combo } from 'src/app/shared/models/combo';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DetalhesEstoqueComponent } from 'src/app/core/dialogs/detalhes-estoque/detalhes-estoque.component';

@Component({
	selector: 'app-estoque',
	templateUrl: './estoque.component.html',
	styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
	paginacaoConfig: Paginacao = new Paginacao();
	paginaState: PageEvent = {
		pageIndex: 0,
		pageSize: this.paginacaoConfig.pageSize,
		length: 0
	};
	filtrosTabela: filtroEstoque;
	tabela: Array<ControleEstoque>;
	comboTiposEstoque: Array<Combo>;
	constructor(
		private relatorioService: RelatorioService,
		private appService: AppService,
		private dialog: MatDialog
	) {
		this.filtrosTabela = {
			ID: { valor: '' },
			Descricao: { valor: '' },
			Localizacao: { valor: '' },
			Qtde: { valor: null },
			Estoque_max: { valor: null },
			Estoque_min: { valor: null },
			Tipo: { valor: null }
		};
	}

	ngOnInit() {
		this.getCombos();
		this.getEstoque();
	}
	getCombos(): void {
		this.appService
			.getCombo('tipo_estoque')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboTiposEstoque = data.json;
			});

	}
	getEstoque(): void {
		this.relatorioService.getEstoque(this.filtrosTabela, this.paginaState)
			.subscribe((data: { tableSize: number; json: Array<ControleEstoque> }) => {
				if (data.json.length > 0) {
					this.paginaState.length = data.tableSize;
					this.tabela = data.json;

				} else {
					this.tabela = [];
				}

			});
	}
	pageEvent($event: PageEvent): void {
		this.paginaState = $event;
		this.getEstoque();
	}

	abrirDetalhes(item: ControleEstoque): void {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '70vw';
		dialogConfig.data = item;
		dialogConfig.panelClass = 'model-cadastro';
		const dialogRef = this.dialog.open(DetalhesEstoqueComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getEstoque();
			}
		});

	}
}

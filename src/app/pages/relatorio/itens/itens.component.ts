import { Component, OnInit } from '@angular/core';
import { RelatorioService } from '../relatorio.service';
import { Itens } from 'src/app/shared/models/itens';
import { ThemePalette } from '@angular/material/core';
import { Combo } from 'src/app/shared/models/combo';
import { AppService } from 'src/app/core/services/app.service';
import { filtroItens } from 'src/app/shared/models/tabela';
import * as moment from 'moment';
import { PageEvent } from '@angular/material/paginator';
import { Paginacao } from 'src/app/shared/models/paginacao';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SelectionComponent } from 'src/app/core/dialogs/selection/selection.component';
import { DetalhesItemComponent } from 'src/app/core/dialogs/detalhes-item/detalhes-item.component';

@Component({
	selector: 'app-itens',
	templateUrl: './itens.component.html',
	styleUrls: ['./itens.component.scss']
})
export class ItensComponent implements OnInit {
	paginacaoConfig: Paginacao = new Paginacao();
	paginaState: PageEvent = { 
		pageIndex: 0,
		pageSize: this.paginacaoConfig.pageSize,
		length: 0
	};
	filtrosTabela: filtroItens;
	color: ThemePalette = 'primary';
	tabela: Array<Itens>;
	comboStatusItens: Array<Combo>;
	comboServicoExterno: Array<Combo>;
	constructor(
		private relatorioService: RelatorioService,
		private appService: AppService,
		private dialog: MatDialog
	) { 
		this.filtrosTabela = {
			'ID': { valor: '' }, 
			'Cliente': { valor: '' },
			'Descricao': { valor: '' },
			'Dt_venda': { 
				valorMin: moment().startOf('month'),
				valorMax: moment()
			},
			'Status': { valor: null },
			'Financeiro': {valor : null}
		}
		// this.filtrosTabela.ID = {valor: ''};
		// this.filtrosTabela.Cliente = {valor: ''};
		// this.filtrosTabela.Descricao = {valor: ''};
		// this.filtrosTabela.Dt_venda = {valorMin: moment().startOf('month'), valorMax: moment()};
		// this.filtrosTabela.Status = {valor: null};
	}
	
	ngOnInit() {		
		this.getCombos();
		this.getItens();
		
	}
	getCombos(): void {
		this.appService
			.getCombo('status_itens')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboStatusItens = data.json;
			});
		this.appService
			.getCombo('serviço_externo')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboServicoExterno = data.json;
			});
	}
	getItens(): void {
		this.relatorioService.getItens(this.filtrosTabela, this.paginaState)
			.subscribe((data: { tableSize: number; json: Array<Itens> }) => {
				if (data.json.length > 0) {
					this.paginaState.length = data.tableSize;
					this.tabela = data.json;
					
				} else {
					this.tabela = []
				}

			})
	}
	pageEvent($event: PageEvent): void {		
		this.paginaState = $event;
		this.getItens();
	}

	entrega(): void {
		const itensChecked = this.tabela.filter(t => t.check);
		let cliente = itensChecked.map(itens => { return itens.ID_CLIENTE });
		cliente = cliente.reduce((acc, cur) => acc.includes(cur) ? acc : [...acc,cur], [])
		if(cliente.length > 1) {
			this.appService.popup('error', 'Para gerar relatorio de entrega selecione itens de apenas 1 cliente');
			return
		} else  if (cliente.length == 0){
			this.appService.popup('error', 'Para gerar relatorio de entrega selecione ao menos 1 item');
			return
		}
		const itensEntrega = itensChecked.map(itens => {
			return { 'ID_ITEM_VENDIDO':itens.ID_ITEM_VENDIDO, 'STATUS': 'Entregue' }			
		})
		
		this.relatorioService.salvarEntrega(itensEntrega)
			.subscribe((data: { query: string; json: Array<{ID_ITEM_VENDIDO: number, STATUS: string}> })=>{
				if (data.json.length > 0) {
					this.appService.popup('success', 'Itens Entregue');
					this.getItens();
					this.gerarRelatorio(itensChecked, {tipo:'Venda',ID: itensChecked[0].ID_CLIENTE, descricao: itensChecked[0].NM_CLIENTE });
				} else {
					this.appService.popup('error', 'Erro ao atualizar o status de Itens Entregue');
				}
			})
			
	}
	
	gerarRelatorio(itens: Array<Itens>, dados: {tipo: string, ID: number, descricao: string, }): void {
		this.relatorioService.gerarRelatorio(itens, dados)
			.subscribe((data: { path: string, status: boolean}) => {
				if (data.status){
					this.appService.popup('success', 'Relatorio Gerado');
					window.open(
						data.path,
						"_blank"
					)

				}
				
			})
	}
	selectAll($event: MatCheckboxChange): void {		
		this.tabela.map(item => {
			item.check = $event.checked;
		})		
	} 

	romaneio(): void {

		const itensChecked = this.tabela.filter(t => t.check);	
		if (itensChecked.length === 0) {
			this.appService.popup('error', 'Para envio a tempera selecione ao menos 1 item');
			return
		}


		const dialogConfig = new MatDialogConfig();
		
		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '260px';
		dialogConfig.data = { title: 'Serviço Externo', data: this.comboServicoExterno };
		const dialogRef = this.dialog.open(SelectionComponent, dialogConfig);

		dialogRef.afterClosed().subscribe((result: Combo) => {
			if (result){
				
				const itensEntrega = itensChecked.map(itens => {
					return { 'ID_ITEM_VENDIDO':itens.ID_ITEM_VENDIDO, 'STATUS': 'Tempera' }			
				})
				
				this.relatorioService.salvarEntrega(itensEntrega)
					.subscribe((data: { query: string; json: Array<{ID_ITEM_VENDIDO: number, STATUS: string}> })=>{
						if (data.json.length > 0) {
							this.appService.popup('success', 'Itens enviado a tempera');
							this.getItens();							
							this.gerarRelatorio(itensChecked, {tipo:'Serviço',ID: result.VALOR, descricao: result.LABEL });
						} else {
							this.appService.popup('error', 'Erro ao atualizar o status de tempera');
						}
					})
			}
		});
	}

	abrirDetalhes(item: Itens): void {
		const dialogConfig = new MatDialogConfig();
		
		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '70vw';
		dialogConfig.data = item;
		dialogConfig.panelClass = 'model-cadastro';
		const dialogRef = this.dialog.open(DetalhesItemComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {			
		});

	}
}

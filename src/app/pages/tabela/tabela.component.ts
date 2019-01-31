import { Component, OnInit } from '@angular/core';
import { TabelaService } from './tabela.service';

import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';



@Component({
	selector: 'app-tabela',
	templateUrl: './tabela.component.html',
	styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

	tabelaTotal =
		{
			coluna1: null,
			coluna2: null,
			coluna3: null,
			coluna4: null,
			coluna5: null
		};
	tabela: Array<any>;
	cabecalho = {
		valPedidos: 0,
		valCaixa: 0
	};

	fromDate: NgbDate;
	toDate: NgbDate;
	today: NgbDate;
	cliente: String;
	openRow: number;
	constructor(private tableService: TabelaService, calendar: NgbCalendar) {
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getToday();
		this.today = calendar.getToday();
	}

	ngOnInit() {
		// this.tabela = [)
		// 	{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 },
		// 	{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 }
		// ];
		this.getListaVendas();
		this.getCabecalho();
	}

	convertNgbMoment(data: NgbDate): String {
		let newMoment = moment();
		data.month--;
		newMoment.month(data.month);
		newMoment.dates(data.day);
		newMoment.year(data.year);
		data.month++;
		return newMoment.format('MM-DD-YYYY');
	}
	onDateSelection(date: NgbDate) {

		if (date.equals(this.fromDate) && date.after(this.toDate)) {
			this.toDate = this.fromDate;
		} else if (date.equals(this.toDate) && date.before(this.fromDate)) {
			this.fromDate = this.toDate;
		}
		this.getListaVendas();
	}
	open(item: any): void {
		this.openRow = this.openRow == item.ven_codigo ? 0 : item.ven_codigo;	
	}

	getCabecalho(): void {
		
		this.tableService.cabecalho(this.today)
			.subscribe((data: Array<any>) => {
				this.cabecalho.valPedidos = data[0].VALOR;
				this.cabecalho.valCaixa = data[1].VALOR;

			});
	}

	getListaVendas(): void {
		let min = this.convertNgbMoment(this.fromDate);
		let max = this.convertNgbMoment(this.toDate);
		this.tableService.listVendas(min,max,this.cliente)
			.subscribe((data: Array<any>) => {
				
				this.tabelaTotal.coluna1 = data.length;
				this.tabelaTotal.coluna4 = 0;
				this.tabelaTotal.coluna5 = 0;
				data.map(tab => {
					this.tabelaTotal.coluna4 += tab.ven_total;
				});
				this.tabela = data;
				this.getListaCaixa(min,max);
			});
	}
	getListaCaixa(min: String, max: String): void {
		this.tableService.listCaixa(min, max, this.cliente)
			.subscribe((data: any) => {
				
				const caixa = data;
				caixa.forEach(tab => {	
					this.tabelaTotal.coluna5 += tab.CAI_PAGAMENTO != null ? (tab.CAI_CREDITO + tab.CAI_DEBITO) : 0;
					
					let index = this.tabela.findIndex(el => {return el.ven_codigo == tab.CAI_ID*1});
					if( index != -1) {							
						let json = {
							codigo: tab.CAI_CODIGO,
							dt_pagamento: tab.CAI_PAGAMENTO,
							credito: tab.CAI_CREDITO,
							debito: tab.CAI_DEBITO,
							forma: tab.CAI_FORMA,
							categoria: tab.CAI_CATEGORIA
						}
						this.tabela[index].caixa.push(json);
						let pagos = this.tabela[index].caixa.filter(el => {return el.dt_pagamento != null });
						let caixas = this.tabela[index].caixa.length;
						let pago = 0;
						pagos.map((a) => {
							pago += a.credito;
						})
						this.tabela[index].qtde_pago = pago;
						if(pagos.length == caixas){
							this.tabela[index].status_pagamento = 'Pago'
						}else if (pagos.length > 0){
							this.tabela[index].status_pagamento = 'Parcial'
						}
					}
				});
				console.log(this.tabela);
			});

		
	}

}

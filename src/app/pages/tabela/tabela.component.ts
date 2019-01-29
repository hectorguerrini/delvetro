import { Component, OnInit } from '@angular/core';
import { TabelaService } from './tabela.service';

import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';



@Component({
	selector: 'app-tabela',
	templateUrl: './tabela.component.html',
	styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

	tabela: any;
	cabecalho = {
		valPedidos: 0,
		valCaixa: 0
	};

	fromDate: NgbDate;
	toDate: NgbDate;
	today: NgbDate;

	constructor(private tableService: TabelaService, calendar: NgbCalendar) {
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getToday();
		this.today = calendar.getToday();
	}

	ngOnInit() {
		this.tabela = [
			{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 },
			{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 }
		];
		// this.getListaVendas();
		// this.getListaCaixa();
	}

	onDateSelection(date: NgbDate) {

		if (date.equals(this.fromDate) && date.after(this.toDate)) {
			this.toDate = this.fromDate;
		} else if (date.equals(this.toDate) && date.before(this.fromDate)) {
			this.fromDate = this.toDate;
		}

	}

	getListaVendas(): void {
		this.tableService.listVendas()
			.subscribe((data: any) => {
				this.cabecalho.valPedidos = 0;
				this.tabela = data;
				this.tabela.map(tab => {
					this.cabecalho.valPedidos += tab.VEN_TOTAL;
				});
			});
	}
	getListaCaixa(): void {
		this.tableService.listCaixa()
			.subscribe((data: any) => {
				this.cabecalho.valCaixa = 0;
				const caixa = data;
				caixa.map(tab => {
					this.cabecalho.valCaixa += (tab.CAI_CREDITO + tab.CAI_DEBITO);
				});
			});
	}

}

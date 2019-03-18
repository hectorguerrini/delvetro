import { Component, OnInit, ViewChild } from '@angular/core';
import { TabelaService } from './tabela.service';

import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
moment.locale('pt-br');
import { Paginacao } from 'src/app/models/paginacao';
import { MatPaginator } from '@angular/material/paginator';
import { Tabela } from 'src/app/models/tabela';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
	selector: 'app-tabela',
	templateUrl: './tabela.component.html',
	styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {

	@ViewChild(MatPaginator) paginator: MatPaginator;
	tabelaTotal =
		{
			coluna1: null,
			coluna2: null,
			coluna3: null,
			coluna4: null,
			coluna5: null
		};
	tabActive: Tabela;

	tabTabela = new Array<Tabela>();


	tabela: Array<any>;
	tabelaFilter: Array<any>;
	// tipoTabela = new String('pedidos');
	paginacao: Paginacao;
	// colspan = 4;
	// filtro = {
	// 	pedido: {
	// 		filter: true,
	// 		fromDate: null,
	// 		toDate: null
	// 	},
	// 	pagamento: {
	// 		filter: false,
	// 		fromDate: null,
	// 		toDate: null
	// 	},
	// 	cliente: '',
	// 	fechamento: {
	// 		fromDate: null,
	// 		toDate: null
	// 	}
	// }

	today: NgbDate;


	openRow: any;
	pagamento: String;

	constructor(private tableService: TabelaService, calendar: NgbCalendar) {

		// this.filtro.pagamento.fromDate = calendar.getToday();
		// this.filtro.pagamento.toDate = calendar.getToday();
		// this.filtro.pedido.fromDate = calendar.getToday();
		// this.filtro.pedido.toDate = calendar.getToday();
		this.today = calendar.getToday();
		this.gerarTabs();
	}

	ngOnInit() {
		this.paginacao = new Paginacao;
	}

	gerarTabs(): void {

		let tab = new Tabela('pedidos', 4);
		tab.addCol('d', this.today, this.today, true);
		tab.addCol('d', this.today, this.today, false);
		tab.addCol('s');
		tab.addCol('$');
		this.tabTabela.push(tab);
		tab = new Tabela('fechamento', 3);
		tab.addCol('d', this.today, this.today);
		tab.addCol('s');
		tab.addCol('$');
		this.tabTabela.push(tab);
		tab = new Tabela('gastos', 3);
		tab.addCol('d', this.today, this.today);
		tab.addCol('s');
		tab.addCol('$');
		this.tabTabela.push(tab);

		this.getList(this.tabTabela[0].nome);
	}
	getList(tipo: String): void {
		if (tipo === 'pedidos') {
			this.tabActive = this.tabTabela[0];
			this.getListaVendas();
		} else if (tipo === 'fechamento') {
			this.tabActive = this.tabTabela[1];
			this.getListaFechamento();
		} else if (tipo === 'gastos') {
			this.tabActive = this.tabTabela[2];
			this.getListaGastos();
		}
	}
	getListaGastos(): void {
		this.tableService.listGastos(this.tabActive.filtros)
		.subscribe((data: any) => {
			this.tabelaTotal.coluna1 = data.length;
			this.tabelaTotal.coluna3 = 0;
			this.tabelaTotal.coluna4 = 0;
			data.map(tab => {
				this.tabelaTotal.coluna3 += tab.valorCredito;
				this.tabelaTotal.coluna4 += tab.valorDebito;
			});
			this.paginacao.lista = data;
		});

	}
	getListaFechamento(): void {
		this.tableService.listFechamento(this.tabActive.filtros)
		.subscribe((data: any) => {
			this.tabelaTotal.coluna1 = data.length;
			this.tabelaTotal.coluna3 = 0;
			this.tabelaTotal.coluna4 = 0;
			data.map(tab => {
				this.tabelaTotal.coluna3 += tab.valorCredito;
				this.tabelaTotal.coluna4 += tab.valorDebito;
			});
			this.paginacao.lista = data;
		});

	}
	setFilter(tipo: String): void {
		if (tipo === 'pedido') {
			this.tabActive.filtros[0].filter = !this.tabActive
				.filtros[0].filter;
			this.tabActive.filtros[1].filter =
				!this.tabActive.filtros[0].filter &&
				!this.tabActive.filtros[1].filter
					? true
					: this.tabActive.filtros[1].filter;
		} else {
			this.tabActive.filtros[1].filter = !this.tabActive
				.filtros[1].filter;
			this.tabActive.filtros[0].filter =
				!this.tabActive.filtros[0].filter &&
				!this.tabActive.filtros[1].filter
					? true
					: this.tabActive.filtros[0].filter;
		}
		this.getListaVendas();
	}

	exportPDF(index): void {
		this.openRow = this.paginacao.lista[index];
		setTimeout(() => {
			let data = document.getElementById(`linha${index}`);
			html2canvas(data).then(canvas => {
				var imgWidth = 208;
				var pageHeight = 295;
				var imgHeight = canvas.height * imgWidth / canvas.width;
				var heightLeft = imgHeight;
				const contentDataURL = canvas.toDataURL('image/png');
				let pdf = new jspdf('p', 'mm', 'a4');

				var position = 0;
				console.log(`Height ${imgHeight} - Width ${imgWidth}`);

				pdf.setFontSize(12);
				pdf.setFont('helvetica');
				pdf.setFontStyle('normal');

				pdf.text(`Relatório extraído em ${moment().format('LLLL')}`, 10 , 10 );

				pdf.addImage(contentDataURL, 'PNG', 1, 15, imgWidth, imgHeight);

				pdf.save(`${this.openRow.formaPagamento}.pdf`);
			});
		}, 500);

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
	onDateSelection(date: NgbDate, tipo: String) {

		if (tipo === 'coluna1') {
			if (date.equals(this.tabActive.filtros[0].valorMin) && date.after(this.tabActive.filtros[0].valorMax)) {
				this.tabActive.filtros[0].valorMax = this.tabActive.filtros[0].valorMin;
			} else if (date.equals(this.tabActive.filtros[0].valorMax) && date.before(this.tabActive.filtros[0].valorMin)) {
				this.tabActive.filtros[0].valorMin = this.tabActive.filtros[0].valorMax;
			}
			if (this.tabActive.nome === 'pedidos' && this.tabActive.filtros[0].filter) {
				this.getListaVendas();
			} else if (this.tabActive.nome === 'fechamento') {
				this.getListaFechamento();
			} else if (this.tabActive.nome === 'gastos') {
				this.getListaGastos();
			}
		} else {
			if (date.equals(this.tabActive.filtros[1].valorMin) && date.after(this.tabActive.filtros[1].valorMax)) {
				this.tabActive.filtros[1].valorMax = this.tabActive.filtros[1].valorMin;
			} else if (date.equals(this.tabActive.filtros[1].valorMax) && date.before(this.tabActive.filtros[1].valorMin)) {
				this.tabActive.filtros[1].valorMin = this.tabActive.filtros[1].valorMax;
			}
			if (this.tabActive.filtros[1].filter) {
				this.getListaVendas();
			}
		}

	}
	open(item: any): void {
		// this.openRow = this.openRow == item.ven_codigo ? 0 : item.ven_codigo;
		this.openRow = this.openRow === item ? false : item ;
	}

	isActive(btn: String): boolean {
		return btn === this.pagamento;
	}
	setActive(btn: String): void {
		if (this.pagamento === btn) {
			this.pagamento = null;
		} else {
			this.pagamento = btn;
		}
		this.tabelaFilter = [];
		if (this.pagamento === 'NPago') {
			this.tabelaFilter = this.tabela.filter(el => { return el.status_pagamento === 'Ñ Pago'; });
		} else if (this.pagamento === 'Pago') {
			this.tabelaFilter = this.tabela.filter(el => { return el.status_pagamento === 'Pago' || el.status_pagamento === 'Parcial'; });
		} else {
			this.tabelaFilter = this.tabela;
		}
		this.paginator.pageIndex = 0;
		this.paginacao.index = 0;
		this.paginacao.length = this.tabelaFilter.length;
		this.paginacao.lista = this.tabelaFilter.slice(
			this.paginacao.index * this.paginacao.pageSize,
			(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
		);
	}

	page(event) {
		this.tabelaFilter = this.tabelaFilter ? this.tabelaFilter : this.tabela;
		this.paginacao.pageSize = event.pageSize;
		this.paginacao.index = event.pageIndex;
		this.paginacao.lista = this.tabelaFilter.slice(
			this.paginacao.index * this.paginacao.pageSize,
			(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
		);
	}

	getListaVendas(): void {
		this.tableService.listVendas(this.tabActive.filtros)
			.subscribe((data: Array<any>) => {

				this.tabelaTotal.coluna1 = data.length;
				this.tabelaTotal.coluna3 = null;
				this.tabelaTotal.coluna4 = 0;
				this.tabelaTotal.coluna5 = 0;
				data.map(tab => {
					this.tabelaTotal.coluna4 += tab.ven_total;
				});
				this.tabela = data;
				this.getListaCaixa();
			});
	}
	getListaCaixa(): void {
		this.tableService.listCaixa(this.tabActive.filtros)
			.subscribe((data: any) => {

				const caixa = data;
				caixa.forEach(tab => {
					this.tabelaTotal.coluna5 += tab.CAI_PAGAMENTO != null ? (tab.CAI_CREDITO) : 0;

					let index = this.tabela.findIndex(el => { return el.ven_codigo === tab.CAI_ID * 1; });
					if (index !== -1) {
						const json = {
							codigo: tab.CAI_CODIGO,
							dt_pagamento: tab.CAI_PAGAMENTO,
							credito: tab.CAI_CREDITO,
							debito: tab.CAI_DEBITO,
							forma: tab.CAI_FORMA,
							categoria: tab.CAI_CATEGORIA
						};
						this.tabela[index].caixa.push(json);
						let pagos = this.tabela[index].caixa.filter(el => { return el.dt_pagamento != null; });
						let caixas = this.tabela[index].caixa.length;
						let pago = 0;
						pagos.map((a) => {
							pago += (a.credito);
						});
						this.tabela[index].qtde_pago = pago;
						if (pagos.length === caixas) {
							this.tabela[index].status_pagamento = 'Pago';
						} else if (pagos.length > 0) {
							this.tabela[index].status_pagamento = 'Parcial';
						}
					}
				});
				this.paginacao.length = this.tabela.length;
				this.paginacao.lista = this.tabela.slice(
					this.paginacao.index * this.paginacao.pageSize,
					(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
				);
				console.log(this.tabela);
			});


	}
}

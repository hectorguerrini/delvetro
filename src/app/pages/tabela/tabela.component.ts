import { Component, OnInit, ViewChild } from '@angular/core';
import { TabelaService } from './tabela.service';

import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
moment.locale('pt-br')
import { Paginacao } from 'src/app/models/paginacao';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';



@Component({
	selector: 'app-tabela',
	templateUrl: './tabela.component.html',
	styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {
	chart: Chart;
	@ViewChild(MatPaginator) paginator: MatPaginator;
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
	paginacao: Paginacao;	
	mesFiltro = moment().format('MM/YYYY')
	fromDate: NgbDate;
	toDate: NgbDate;
	today: NgbDate;
	cliente: String;
	openRow: Number;
	pagamento: String;
	colors: Array<string> = ['green','blue','red']
	comboMes: Array<any> = [];
	constructor(private tableService: TabelaService, calendar: NgbCalendar) {
		
		this.fromDate = calendar.getToday();
		this.toDate = calendar.getToday();
		this.today = calendar.getToday();

		for(let i=0; i<=12; i++){
			this.comboMes.push({
				valor: moment().subtract(i, 'month').format('MM/YYYY'),
				label: moment().subtract(i, 'month').format('MMM/YYYY')
			})
		}

		Highcharts.setOptions({
			lang: {
				thousandsSep: '.',
				decimalPoint: ','
			},
		})
		this.chart = new Chart({
			chart: {
				type: 'pie',
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				width: 240,
				height: 250

			},
			title: {
				text: null,
				align: 'center',
				verticalAlign: 'middle',
				y: 50
			},
			exporting: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: true,
						distance: -30,
						format: '<b>{point.percentage:.1f} %',
						style: {
							fontWeight: 'bold',
							color: 'white'
						}
					},
					startAngle: -90,
					endAngle: 90,
					center: ['50%', '50%'],
					size: '100%',
					innerSize: '50%'

				}
			},
			tooltip: {
				pointFormat: '<b>R$ {point.y:,.2f}</b>'
				
			},
			series: [
				// <Highcharts.SeriesColumnOptions> {														
				// 	name:'line 1',
				// 	data: [
				// 		{name: 'A', y: 24, color:'red'},
				// 		{name: 'B', y: 12, color:'green'},
				// 		{name: 'C', y: 1, color:'blue'},	
				// 	],

				// }
			]
		});

	}

	ngOnInit() {
		// this.tabela = [)
		// 	{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 },
		// 	{ VEN_DATA: '2019-01-29', VEN_RESPONSAVEL: 'Mercato Delvetro', VEN_TOTAL: 5594.50 }
		// ];
		this.paginacao = new Paginacao;
		this.getListaVendas();
		this.getCabecalho();
		this.getGrafico();
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

	isActive(btn: String): boolean {
		return btn === this.pagamento;
	}
	setActive(btn: String): void {
		if (this.pagamento === btn) {
			this.pagamento = null;
		} else {
			this.pagamento = btn;
		}
		let saida = [];
		if (this.pagamento === 'NPago') {
			saida = this.tabela.filter(el => { return el.status_pagamento === 'Ñ Pago' });
		} else if (this.pagamento === 'Pago') {
			saida = this.tabela.filter(el => { return el.status_pagamento === 'Pago' || el.status_pagamento === 'Parcial' });
		} else {
			saida = this.tabela;
		}
		this.paginator.pageIndex = 0;
		this.paginacao.index = 0;
		this.paginacao.length = saida.length;
		this.paginacao.lista = saida.slice(
			this.paginacao.index * this.paginacao.pageSize,
			(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
		);
	}

	page(event) {
		this.paginacao.pageSize = event.pageSize;
		this.paginacao.index = event.pageIndex;
		this.paginacao.lista = this.tabela.slice(
			this.paginacao.index * this.paginacao.pageSize,
			(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
		);
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
		this.tableService.listVendas(min, max, this.cliente)
			.subscribe((data: Array<any>) => {

				this.tabelaTotal.coluna1 = data.length;
				this.tabelaTotal.coluna4 = 0;
				this.tabelaTotal.coluna5 = 0;
				data.map(tab => {
					this.tabelaTotal.coluna4 += tab.ven_total;
				});
				this.tabela = data;
				this.getListaCaixa(min, max);
			});
	}
	getListaCaixa(min: String, max: String): void {
		this.tableService.listCaixa(min, max, this.cliente)
			.subscribe((data: any) => {

				const caixa = data;
				caixa.forEach(tab => {
					this.tabelaTotal.coluna5 += tab.CAI_PAGAMENTO != null ? (tab.CAI_CREDITO + tab.CAI_DEBITO) : 0;

					let index = this.tabela.findIndex(el => { return el.ven_codigo == tab.CAI_ID * 1 });
					if (index != -1) {
						let json = {
							codigo: tab.CAI_CODIGO,
							dt_pagamento: tab.CAI_PAGAMENTO,
							credito: tab.CAI_CREDITO,
							debito: tab.CAI_DEBITO,
							forma: tab.CAI_FORMA,
							categoria: tab.CAI_CATEGORIA
						}
						this.tabela[index].caixa.push(json);
						let pagos = this.tabela[index].caixa.filter(el => { return el.dt_pagamento != null });
						let caixas = this.tabela[index].caixa.length;
						let pago = 0;
						pagos.map((a) => {
							pago += (a.credito + a.debito);
						})
						this.tabela[index].qtde_pago = pago;
						if (pagos.length == caixas) {
							this.tabela[index].status_pagamento = 'Pago'
						} else if (pagos.length > 0) {
							this.tabela[index].status_pagamento = 'Parcial'
						}
					}
				});
				this.paginacao.length = this.tabela.length;
				this.paginacao.lista = this.tabela.slice(
					this.paginacao.index * this.paginacao.pageSize,
					(this.paginacao.index * this.paginacao.pageSize) + this.paginacao.pageSize
				);
				console.log(this.paginacao);
			});


	}

	getGrafico(): void {
		this.chart.removeSeries(0);
		this.tableService.grafico(this.mesFiltro)
			.subscribe((data: any) => {
				let serie = <Highcharts.SeriesColumnOptions>{
					name: 'Faturamento',
					data: []
				}
				data.map((el, i) => {
					serie.data.push({
						name: el.LABEL,
						y: el.VALOR,
						color: this.colors[i]
					})
				})
				
				this.chart.addSeries(serie, true, false);
			})
	}

}

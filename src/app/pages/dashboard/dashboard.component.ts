import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { DashboardService } from './dashboard.service';
import { ChartPie } from 'src/app/models/chart-pie';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	chart: Chart;
	cabecalho = {
		valPedidos: 0,
		valCaixa: 0
	};

	colors: Array<string> = ['green', 'blue', 'red'];
	comboMes: Array<any> = [];
	mesFiltro = moment().format('MM/YYYY');

	constructor(private dashboardService: DashboardService) { }

	ngOnInit() {
		for (let i = 0; i <= 12; i++) {
			this.comboMes.push({
				valor: moment().subtract(i, 'month').format('MM/YYYY'),
				label: moment().subtract(i, 'month').format('MMM/YYYY')
			});
		}

		Highcharts.setOptions({
			lang: {
				thousandsSep: '.',
				decimalPoint: ','
			},
		});
		this.chart = new ChartPie().graficoPie;
		this.getGrafico();
	}
	getGrafico(): void {
		this.chart.removeSeries(0);
		this.dashboardService.grafico(this.mesFiltro)
			.subscribe((data: any) => {
				const serie = <Highcharts.SeriesColumnOptions>{
					name: 'Faturamento',
					data: []
				};
				this.cabecalho.valCaixa = 0;
				data.map((el, i) => {
					serie.data.push({
						name: el.LABEL,
						y: el.VALOR,
						color: this.colors[i]
					});
					this.cabecalho.valCaixa += el.VALOR;
				});

				this.chart.addSeries(serie, true, false);
			});
	}

}

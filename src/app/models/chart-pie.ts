import { Chart } from 'angular-highcharts';

export class ChartPie {
	graficoPie: Chart;

	constructor() {
		this.graficoPie = new Chart({
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
}

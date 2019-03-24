import { Chart } from 'angular-highcharts';

export class ChartLine {
    graficoLinha: Chart;

    constructor() {
        this.graficoLinha = new Chart({
			chart: {
                type: 'line',                
				height: 250			                
			},
			title: {
				text:'Faturamento Cliente Mês'
            },
            
			exporting: {
				enabled: false
            },
            yAxis:{
                title: null
            },
            xAxis: {
                categories: []
            },
			credits: {
				enabled: false
            },
            legend:{
                enabled: false
            },
			plotOptions: {
			
			},
			tooltip: {
				pointFormat: '<b>R$ {point.y:,.2f}</b>'				
			},
			series: [ 
                // <Highcharts.SeriesColumnOptions> {
                // name: 'Installation',
                // data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                // }				
			]
		});
    }
}

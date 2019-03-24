import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartLine } from 'src/app/models/chart-line';
import { ClienteService } from './cliente.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  chartLineMes: Chart;
  id_cliente: Number;
  cabecalho: any;
  combo = {
    cliente: []
  }
  cliente: any;
  
  constructor(private clienteService: ClienteService,private acRoute: ActivatedRoute) {
    clienteService.getCombo('cliente')
    .subscribe((data: any) => {
      this.combo.cliente = data;
    })
    
  }

  ngOnInit() {
    this.chartLineMes = new ChartLine().graficoLinha;
    this.acRoute.paramMap.subscribe(params => {
      if(params.get('id') != null){
        this.id_cliente = parseInt(params.get('id'));
        this.getCabecalho();
        this.getGraficoLinha();
      } else {
        this.id_cliente = null;
      }
    })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.combo.cliente.map(el => el.LABEL)
        : this.combo.cliente.filter(v => v.LABEL.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(el => el.LABEL)
          .slice(0, 10)
        )
    )
  getCabecalho(): void{
    this.clienteService.cabecalho(this.id_cliente)
    .subscribe((data: any) => {
      this.cabecalho = data[0];
    })

  }
  getGraficoLinha(): void{
    this.clienteService.graficoLinha(this.id_cliente)
    .subscribe((data: any) =>{
      let serie = <Highcharts.SeriesColumnOptions>{
        name: 'Credito',
        data: []
      }
      let categories = [];
      let sum = 0;
      //this.cabecalho.valCaixa = 0;
      data.map((el, i) => {
        serie.data.push({
          name: el.LABEL,
          y: el.VALOR,          
        })
        sum += el.VALOR;
        categories.push(moment(el.LABEL, 'YYYY/MM').format('MMM/YY'));
        //this.cabecalho.valCaixa += el.VALOR;
      })
      this.chartLineMes.ref.xAxis[0].setCategories(categories);
      
      // const sub = <Highcharts.SubtitleOptions>{
      //   text: `Total <strong>R$ ${sum.toFixed(2)}</strong>`,
      //   useHTML: true
      // }
      // this.chartLineMes.ref.setSubtitle(sub);
      this.chartLineMes.addSeries(serie, true, true);
      
    })

  }
}

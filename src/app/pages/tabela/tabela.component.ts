import { Component, OnInit } from '@angular/core';
import { TabelaService } from './tabela.service';


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
  }
  constructor(private tableService: TabelaService) { }

  ngOnInit() {
    this.getListaVendas();
    this.getListaCaixa();
  }

  getListaVendas(): void{
    this.tableService.listVendas()
    .subscribe((data:any)=> {
      this.cabecalho.valPedidos = 0;
      this.tabela = data;
      this.tabela.map(tab => {
        this.cabecalho.valPedidos += tab.VEN_TOTAL
      })
    })
  }
  getListaCaixa(): void{
    this.tableService.listCaixa()
    .subscribe((data:any)=> {
      this.cabecalho.valCaixa = 0;
      let caixa = data
      caixa.map(tab => {
        this.cabecalho.valCaixa += (tab.CAI_CREDITO+tab.CAI_DEBITO)
      })
    })
  }
  
}

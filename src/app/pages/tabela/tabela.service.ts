import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TabelaService {

  url = environment.url;

  constructor(public http: HttpClient) { }
  convertNgbMoment(data: NgbDate): String {
    let newMoment = moment();
    data.month--;
    newMoment.month(data.month);
    newMoment.dates(data.day);
    newMoment.year(data.year);
    data.month++;
    return newMoment.format('MM-DD-YYYY');
  }
  listClientes(filtro: any) {
    
    let min = this.convertNgbMoment(filtro[0].valorMin);
    let max = this.convertNgbMoment(filtro[0].valorMax);
    const url = `${this.url}/clientes`;
    var body = {
      dataMin: min,
      dataMax: max,
      clientes: filtro[1].valor
    }
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listGastos(filtro: any) {
    let min = this.convertNgbMoment(filtro[0].valorMin);
    let max = this.convertNgbMoment(filtro[0].valorMax);
    const url = `${this.url}/gastos`;
    var body = {
      dataMin: min,
      dataMax: max,
    }
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listFechamento(filtro: any) {
    let min = this.convertNgbMoment(filtro[0].valorMin);
    let max = this.convertNgbMoment(filtro[0].valorMax);
    const url = `${this.url}/fechamento`;
    var body = {
      dataMin: min,
      dataMax: max,
    }
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listVendas(filtro: any) {
    let minPag = this.convertNgbMoment(filtro[1].valorMin);
		let maxPag = this.convertNgbMoment(filtro[1].valorMax);
		let minPed = this.convertNgbMoment(filtro[0].valorMin);
    let maxPed = this.convertNgbMoment(filtro[0].valorMax);
    
    const url = `${this.url}/listaVendas`;
    var body = {
      pedido: {
        filter: filtro[0].filter,
        dataMin: minPed,
        dataMax: maxPed,
      },
      pagamento: {
        filter: filtro[1].filter,
        dataMin: minPag,
        dataMax: maxPag,
      },
      cliente: filtro[2].valor
    };


    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listCaixa(filtro: any) {
    let minPag = this.convertNgbMoment(filtro[1].valorMin);
		let maxPag = this.convertNgbMoment(filtro[1].valorMax);
		let minPed = this.convertNgbMoment(filtro[0].valorMin);
    let maxPed = this.convertNgbMoment(filtro[0].valorMax);
    
    const url = `${this.url}/listaCaixa`;
    var body = {
      pedido: {
        filter: filtro[0].filter,
        dataMin: minPed,
        dataMax: maxPed,
      },
      pagamento: {
        filter: filtro[1].filter,
        dataMin: minPag,
        dataMax: maxPag,
      },
      cliente: filtro[2].valor
    };


    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  cabecalho(today: NgbDate) {
    
    const url = `${this.url}/cabecalho`;
    var body = {
      dataMin: moment().startOf('month').format('MM-DD-YYYY'),
      dataMax: moment().endOf('month').format('MM-DD-YYYY')
    };


    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }

}

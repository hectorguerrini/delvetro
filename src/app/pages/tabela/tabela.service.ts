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

  listVendas(dataMin: String, dataMax: String, cliente: String) {
    const url = `${this.url}/listaVendas`;    
    var body = { 
      dataMin: dataMin,
      dataMax: dataMax,
      cliente: cliente
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listCaixa(dataMin: String, dataMax: String, cliente: String) {
    const url = `${this.url}/listaCaixa`;   
    var body = { 
      dataMin: dataMin,
      dataMax: dataMax,
      cliente: cliente
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  cabecalho(today:NgbDate) {
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
  grafico(filtro: string) {
    const url = `${this.url}/grafico/faturamento`;   
    var body = { 
      data: moment(filtro, 'MM/YYYY').format('MM-DD-YYYY')
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}

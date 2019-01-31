import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class TabelaService {

  url = 'http://localhost:3000';

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
      dataMin: `0${today.month}-01-2019`,
      dataMax: `0${today.month}-31-2019`
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}

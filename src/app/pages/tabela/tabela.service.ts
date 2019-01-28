import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class TabelaService {

  url = 'http://localhost:3000';

  constructor(public http: HttpClient) { }

  listVendas() {
    const url = `${this.url}/listaVendas`;
    const d = new Date();
    var body = { 
      data: moment().format('MM-DD-YYYY') 
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  listCaixa() {
    const url = `${this.url}/listaCaixa`;
    const d = new Date();
    var body = { 
      data: moment().format('MM-DD-YYYY') 
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}

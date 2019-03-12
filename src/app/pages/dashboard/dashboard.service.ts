import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.url;
  constructor(public http: HttpClient) { }

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

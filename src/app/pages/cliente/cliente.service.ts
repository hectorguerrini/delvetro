import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  url = environment.url;
  constructor(public http: HttpClient) { }

  getCombo(tipo: String) {
    const url = `${this.url}/combo/${tipo}`;   
    
    
    return this.http.get(url,  {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }

  graficoLinha(id_cliente: Number) {
    const url = `${this.url}/${id_cliente}/grafico`;   
    var body = {       
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  cabecalho(id_cliente: Number) {
    const url = `${this.url}/${id_cliente}/cabecalho`;   
    var body = {       
    };
    
    
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}

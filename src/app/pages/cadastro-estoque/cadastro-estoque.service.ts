import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Estoque } from 'src/app/models/estoque';


@Injectable({
  providedIn: 'root'
})
export class CadastroEstoqueService {
  url = environment.url;
  constructor(private http: HttpClient) { }
  getCombo(tipo: String) {
    const url = `${this.url}/combo/${tipo}`;       
    
    return this.http.get(url, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
  cadastroEstoque(estoque: Estoque) {
    const url = `${this.url}/cadastro/estoque`;       
    
    return this.http.post(url, estoque ,{
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}

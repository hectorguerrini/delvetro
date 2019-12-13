import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filtroItens } from 'src/app/shared/models/tabela';
import { PageEvent } from '@angular/material/paginator';
import { Itens } from 'src/app/shared/models/itens';


@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  url = environment.url;
  constructor(public http: HttpClient) { }
  
  getItens(filtros: filtroItens, paginacao: PageEvent) {
		const url = `${this.url}/itens`;

		return this.http.post(url, { filtros, paginacao }, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}

	salvarEntrega(itens: Array<{ID_ITEM_VENDIDO: number, STATUS: string}>) {
		const url = `${this.url}/itens/status`;

		return this.http.post(url, itens, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
	gerarRelatorio(itens: Array<Itens>, dados: {tipo: string, ID: number, descricao: string, }){
		const url = `${this.url}/itens/relatorio`;

		return this.http.post(url, {itens, dados }, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
}

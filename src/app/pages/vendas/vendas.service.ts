import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class VendasService {

	url = environment.url;
	constructor(public http: HttpClient) { }

	getVendasCliente(id_cliente: number) {
		const url = `${this.url}/cadastro/vendas/${id_cliente}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	salvarVenda(venda: any) {
		const url = `${this.url}/cadastro/venda`;

		return this.http.post(url, venda, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});

	}
}

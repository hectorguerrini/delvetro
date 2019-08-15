import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class PagamentosService {
	url = environment.url;
	constructor(public http: HttpClient) { }

	getVendaCliente(id_cliente: number,id_venda: number) {
		const url = `${this.url}/get/venda_recebimento/${id_cliente}/${id_venda}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	salvarPagamento(pagamento: any) {
		const url = `${this.url}/cadastro/recebimento`;

		return this.http.post(url, pagamento, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});

	}
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class PagamentosService {
	url = environment.url;
	constructor(public http: HttpClient) { }

	getVendaCliente(id_venda: number) {
		const url = `${this.url}/get/venda_recebimento/${id_venda}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
}

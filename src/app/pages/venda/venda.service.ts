import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venda } from 'src/app/shared/models/venda';

@Injectable({
	providedIn: 'root'
})
export class VendaService {

	url = environment.url;
	constructor(public http: HttpClient) { }

	getVendasCliente(id_cliente: number) {
		const url = `${this.url}/listaVendas/${id_cliente}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	salvarVenda(venda: Venda) {
		const url = `${this.url}/venda`;

		return this.http.post(url, venda, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});

	}
	getVenda(id_venda: number) {
		const url = `${this.url}/venda/${id_venda}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	onUpload(file: File, id_cliente: number) {
		const url = `${this.url}/upload/${id_cliente}`;
		const uploadData = new FormData();
		uploadData.append('file', file, file.name);
		return this.http.post(url, uploadData);
	}
}

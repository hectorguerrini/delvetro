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
		const url = `${this.url}/cadastro/lista_vendas/${id_cliente}`;

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
	getVenda(id_venda: number) {
		const url = `${this.url}/cadastro/venda/${id_venda}`;

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

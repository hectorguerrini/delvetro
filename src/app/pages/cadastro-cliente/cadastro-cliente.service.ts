import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente';

@Injectable({
	providedIn: 'root'
})
export class CadastroClienteService {
	url = environment.url;
	constructor(public http: HttpClient) { }

	getCombo(tipo: String) {
		const url = `${this.url}/combo/${tipo}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
	cadastroCliente(cliente: Cliente) {
		const url = `${this.url}/cadastro/cliente`;

		return this.http.post(url, cliente, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
	getCliente(id_cliente: number) {
		const url = `${this.url}/cadastro/cliente/${id_cliente}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}

	getCEP(cep: string) {
		const url = `https://viacep.com.br/ws/${cep}/json/`;

		return this.http.get(url, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
}

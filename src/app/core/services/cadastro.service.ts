import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente';
import { Beneficiados } from 'src/app/shared/models/beneficiados';
import { Servico } from 'src/app/shared/models/servico';

@Injectable({
	providedIn: 'root'
})
export class CadastroService {
	url = environment.url;
	constructor(public http: HttpClient) { }

	// Cadastro Cliente
	salvarCliente(cliente: Cliente) {
		const url = `${this.url}/cliente`;

		return this.http.post(url, cliente, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}
	getCliente(id_cliente: number) {
		const url = `${this.url}/cliente/${id_cliente}`;

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

	// Cadastro Serviço
	salvarServico(servico: Servico) {
		const url = `${this.url}/servico`;

		return this.http.post(url, servico, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	getServico(id_servico: number) {
		const url = `${this.url}/servico/${id_servico}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}

	// Cadastro Beneficiado
	salvarBeneficiado(beneficiado: Beneficiados) {
		const url = `${this.url}/beneficiado`;

		return this.http.post(url, beneficiado, {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/json'
			)
		});
	}

}

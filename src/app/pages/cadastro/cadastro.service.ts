import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from 'src/app/shared/models/cliente';
import { Beneficiados } from 'src/app/shared/models/beneficiados';
import { Servico } from 'src/app/shared/models/servico';
import { Estoque } from 'src/app/shared/models/estoque';
import { Produto } from 'src/app/shared/models/produto';

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

	// Cadastro Estoque
	salvarEstoque(estoque: Estoque) {
		const url = `${this.url}/estoque`;

		return this.http.post(url, estoque, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	getEstoque(id_estoque: number) {
		const url = `${this.url}/estoque/${id_estoque}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}

	// Cadastro Produto
	salvarProduto(produto: Produto) {
		const url = `${this.url}/produto`;

		return this.http.post(url, produto, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	getProduto(id_produto: number) {
		const url = `${this.url}/produto/${id_produto}`;

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
	getBeneficiado(id_beneficiado: number) {
		const url = `${this.url}/beneficiado/${id_beneficiado}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}

}

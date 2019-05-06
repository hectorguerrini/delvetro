import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Produto } from 'src/app/models/produto';
import { ComposicaoProdutoEstoque } from 'src/app/models/composicao-produto-estoque';
import { ComposicaoProdutoSevico } from 'src/app/models/composicao-produto-servico';


@Injectable({
	providedIn: 'root'
})
export class CadastroProdutosService {
	url = environment.url;
	constructor(private http: HttpClient) { }
	cadastroProdutos(produto: Produto) {
		const url = `${this.url}/cadastro/produto`;

		return this.http.post(url, produto, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	cadastroComposicaoEstoque(estoque: ComposicaoProdutoEstoque) {
		const url = `${this.url}/cadastro/composicao_produto_estoque`;

		return this.http.post(url, estoque, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	cadastroComposicaoServico(servico: ComposicaoProdutoSevico) {
		const url = `${this.url}/cadastro/composicao_produto_servico`;

		return this.http.post(url, servico, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	getProduto(id_produto: number) {
		const url = `${this.url}/cadastro/produtos/${id_produto}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
}

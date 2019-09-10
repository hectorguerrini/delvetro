import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Despesa } from 'src/app/shared/models/despesa';

@Injectable({
	providedIn: 'root'
})
export class FinanceiroService {

	url = environment.url;
	constructor(public http: HttpClient) { }

	salvarDespesa(despesa: Despesa) {
		const url = `${this.url}/cadastro/despesa`;

		return this.http.post(url, despesa, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}

	getListaDespesas() {
		const url = `${this.url}/cadastro/lista_despesas`;

		return this.http.post(url, {}, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
}

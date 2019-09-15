import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Servico } from 'src/app/shared/models/servico';
@Injectable({
	providedIn: 'root'
})
export class CadastroServicosService {
	url = environment.url;
	constructor(public http: HttpClient) {}

	cadastroServico(servico: Servico) {
		const url = `${this.url}/cadastro/servico`;

		return this.http.post(url, servico, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	getServico(id_servico: number) {
		const url = `${this.url}/cadastro/servico/${id_servico}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
}

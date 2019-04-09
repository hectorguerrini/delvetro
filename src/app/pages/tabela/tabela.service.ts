import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TabelaService {
	url = environment.url;

	constructor(public http: HttpClient) { }
	convertNgbMoment(data: NgbDate): String {
		const newMoment = moment();
		data.month--;
		newMoment.month(data.month);
		newMoment.date(data.day);
		newMoment.year(data.year);
		data.month++;
		return newMoment.format('MM-DD-YYYY');
	}
	listClientes(filtro: any) {
		const min = this.convertNgbMoment(filtro[0].valorMin);
		const max = this.convertNgbMoment(filtro[0].valorMax);
		const url = `${this.url}/clientes`;
		const body = {
			dataMin: min,
			dataMax: max,
			clientes: filtro[1].valor
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	listGastos(filtro: any) {
		const min = this.convertNgbMoment(filtro[0].valorMin);
		const max = this.convertNgbMoment(filtro[0].valorMax);
		const url = `${this.url}/gastos`;
		const body = {
			dataMin: min,
			dataMax: max
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	listFechamento(filtro: any) {
		const min = this.convertNgbMoment(filtro[0].valorMin);
		const max = this.convertNgbMoment(filtro[0].valorMax);
		const url = `${this.url}/fechamento`;
		const body = {
			dataMin: min,
			dataMax: max
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	listVendas(filtro: any) {
		const minPag = this.convertNgbMoment(filtro[1].valorMin);
		const maxPag = this.convertNgbMoment(filtro[1].valorMax);
		const minPed = this.convertNgbMoment(filtro[0].valorMin);
		const maxPed = this.convertNgbMoment(filtro[0].valorMax);

		const url = `${this.url}/listaVendas`;
		const body = {
			pedido: {
				filter: filtro[0].filter,
				dataMin: minPed,
				dataMax: maxPed
			},
			pagamento: {
				filter: filtro[1].filter,
				dataMin: minPag,
				dataMax: maxPag
			},
			cliente: filtro[2].valor
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	listCaixa(filtro: any) {
		const minPag = this.convertNgbMoment(filtro[1].valorMin);
		const maxPag = this.convertNgbMoment(filtro[1].valorMax);
		const minPed = this.convertNgbMoment(filtro[0].valorMin);
		const maxPed = this.convertNgbMoment(filtro[0].valorMax);

		const url = `${this.url}/listaCaixa`;
		const body = {
			pedido: {
				filter: filtro[0].filter,
				dataMin: minPed,
				dataMax: maxPed
			},
			pagamento: {
				filter: filtro[1].filter,
				dataMin: minPag,
				dataMax: maxPag
			},
			cliente: filtro[2].valor
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
	cabecalho(today: NgbDate) {
		const url = `${this.url}/cabecalho`;
		const body = {
			dataMin: moment()
				.startOf('month')
				.format('MM-DD-YYYY'),
			dataMax: moment()
				.endOf('month')
				.format('MM-DD-YYYY')
		};

		return this.http.post(url, body, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}
}

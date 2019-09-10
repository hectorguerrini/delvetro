import { Component, OnInit } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment';
import { FinanceiroService } from '../financeiro/financeiro.service';
import { Tabela, modelTabela } from 'src/app/shared/models/tabela';

@Component({
	selector: 'app-dashboard-financeiro',
	templateUrl: './dashboard-financeiro.component.html',
	styleUrls: ['./dashboard-financeiro.component.scss']
})
export class DashboardFinanceiroComponent implements OnInit {
	view = 'month';

	viewDate: Date = new Date();

	events: CalendarEvent[] = [];
	tabActive: Tabela;
	tabela: Array<modelTabela>;
	constructor(
		private financeiroService: FinanceiroService
	) { }

	ngOnInit() {
		this.tabActive = new Tabela('despesas',7);
		this.tabActive.addCol('s');
		this.tabActive.addCol('s');
		this.tabActive.addCol('d', moment(),moment());
		this.tabActive.addCol('d', moment(),moment());
		this.tabActive.addCol('$');
		this.tabActive.addCol('s');

		this.getListas();
	}

	getListas(): void {
		this.financeiroService.getListaDespesas()
			.subscribe((data: { query: string; json: Array<modelTabela> }) => {
				if (data.json.length > 0 ) {
					this.tabela = data.json;
				} else {
					this.tabela = [];
				}
			});
	}
}

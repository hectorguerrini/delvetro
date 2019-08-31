import { Component, OnInit } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';
import * as moment from 'moment';

@Component({
	selector: 'app-dashboard-financeiro',
	templateUrl: './dashboard-financeiro.component.html',
	styleUrls: ['./dashboard-financeiro.component.scss']
})
export class DashboardFinanceiroComponent implements OnInit {
	view = 'month';

	viewDate: Date = new Date();

	events: CalendarEvent[] = [];
	constructor() { }

	ngOnInit() {
	}

}

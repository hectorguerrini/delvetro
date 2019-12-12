import { Component, OnInit, Inject } from '@angular/core';
import { CalendarEvent, CalendarEventAction, MOMENT } from 'angular-calendar';
import * as moment from 'moment';
import { FinanceiroService } from '../financeiro/financeiro.service';
import { Tabela, ModelTabela } from 'src/app/shared/models/tabela';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanceiroComponent } from '../financeiro/financeiro.component';
import { AppService } from 'src/app/core/services/app.service';
import { Combo } from 'src/app/shared/models/combo';

@Component({
	selector: 'app-dashboard-financeiro',
	templateUrl: './dashboard-financeiro.component.html',
	styleUrls: ['./dashboard-financeiro.component.scss']
})
export class DashboardFinanceiroComponent implements OnInit {
	view = 'month';
	activeDayIsOpen: boolean = false;
	viewDate: Date = new Date();
	colors: any = {
		red: {
		  primary: '#ad2121',
		  secondary: '#FAE3E3'
		},
		blue: {
		  primary: '#1e90ff',
		  secondary: '#D1E8FF'
		},
		yellow: {
		  primary: '#e3bc08',
		  secondary: '#FDF1BA'
		},
		green: {
			primary: '#34eb40',
			secondary: '#98eb9e'
		}
	  };
//	events: CalendarEvent[] = [];
	tabActive: Tabela;
	tabela: Array<ModelTabela>;
	comboCategoria: Array<Combo>;
	constructor(
		private financeiroService: FinanceiroService,
		private dialog: MatDialog,
		private appService: AppService
	) { }

	events: CalendarEvent[] = [	
		// {
		//   start: moment().toDate(),
		//   title: 'An event with no end date',
		//   color: this.colors.yellow
		// },
		// {
		//   start: addHours(startOfDay(new Date()), 2),
		//   end: new Date(),
		//   title: 'A draggable and resizable event',
		//   color: colors.yellow,
		//   actions: this.actions,
		//   resizable: {
		// 	beforeStart: true,
		// 	afterEnd: true
		//   },
		//   draggable: true
		// }
	  ];
	actions: CalendarEventAction[] = [
		{
			label: '<i class="fa fa-fw fa-pencil"></i>',
			onClick: ({ event }: { event: any }): void => {
				this.editarEvento(event.ID_DESPESA)
			}
		}
	];
	
	ngOnInit() {
		this.tabActive = new Tabela('despesas', 7);
		this.tabActive.addCol('s');
		this.tabActive.addCol('c');
		this.tabActive.addCol('d', moment().startOf('month'), moment().endOf('month'));
		this.tabActive.addCol('d', moment().startOf('month'), moment().endOf('month'));
		this.tabActive.addCol('$');
		this.tabActive.addCol('c');

		this.getListas();
		this.getEventos();
		this.getCombos();
		
	}
	getCombos(): void {
		this.appService
			.getCombo('categoria_despesa')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboCategoria = data.json;
			});
	}
	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (moment(this.viewDate).month() === moment(date).month()) {
			if (
				(moment(this.viewDate).day() === moment(date).day() && this.activeDayIsOpen === true)
				|| events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
			}
			this.viewDate = date;
		}
	}
	getListas(): void {
		this.financeiroService.getListaDespesas(this.tabActive.filtros)
			.subscribe((data: { query: string; json: Array<ModelTabela> }) => {
				if (data.json.length > 0) {
					this.tabela = data.json;
					this.tabActive.total.valorTotal = this.tabela.reduce((acc: number, cur) => acc + cur.COLUNA5,0);												
				} else {
					this.tabela = [];
				}
			});
	}

	getEventos(): void {
		this.financeiroService.getEventosCalendario(this.viewDate)
		.subscribe((data: { query: string; json: Array<any> }) => {
			if (data.json.length > 0) {
				this.events = [];
				data.json.forEach(el => {
					el.start = moment(el.start).toDate();
					el.actions = this.actions;
					el.color = this.getColorEvent(el.STATUS_PGTO, el.start);
					this.events.push(el);
				});		
			} else {
				this.events = [];
			}
		});
	}
	getColorEvent(status: string, data: string): {primary: string, secondary: string} {
		let color;

		if (status === 'Pago') {
			color = this.colors.green;
		} else if (moment(data).isAfter(moment())) {
			color = this.colors.blue;
		} else {
			color = this.colors.red;
		}

		return color;
	}
	editarEvento(ID_DESPESA: number): void {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		dialogConfig.data = ID_DESPESA;
		const dialogRef = this.dialog.open(FinanceiroComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.getEventos();
			this.getListas();
			// if (result) {
			// 	this.getEventos();
			// }
		});
	}

	changeFilters(): void {
		this.tabActive.filtros[3] = this.tabActive.filtros[2];
		this.getListas();
	}
}

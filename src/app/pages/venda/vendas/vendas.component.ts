// Core
import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

// Rxjs
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// Services
import { AppService } from 'src/app/core/services/app.service';
import { VendaService } from '../venda.service';

// Models
import { Combo } from 'src/app/shared/models/combo';
import { Venda } from 'src/app/shared/models/venda';
import { VendasLista } from 'src/app/shared/models/vendasLista';

// Components
import { CadastroClienteComponent } from '../../cadastro/cadastro-cliente/cadastro-cliente.component';
import { CadastroVendaComponent } from '../cadastro-venda/cadastro-venda.component';
import { PagamentosComponent } from '../pagamentos/pagamentos.component';

@Component({
	selector: 'app-vendas',
	templateUrl: './vendas.component.html',
	styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

	comboClientes: Array<Combo> = [];
	vendasLista: Array<VendasLista> = [];
	venda = new Venda();
	constructor(
		private appService: AppService,
		private vendasService: VendaService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.appService
			.getCombo('clientes')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboClientes = data.json;
			});
	}
	pagamentos(ID_VENDA: number): void {
		this.venda.ID_VENDA = ID_VENDA ? ID_VENDA : 0;
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		dialogConfig.data = this.venda;
		const dialogRef = this.dialog.open(PagamentosComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.venda.ID_VENDA = 0;
			if (result) {
				this.getVendaLista();
			}
		});
	}
	editarVenda(ID_VENDA: number): void {
		this.venda.ID_VENDA = ID_VENDA;
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		dialogConfig.data = this.venda;
		const dialogRef = this.dialog.open(CadastroVendaComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.venda.ID_VENDA = 0;
			if (result) {
				this.getVendaLista();
			}
		});

	}
	novaVenda(): void {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		dialogConfig.data = this.venda;
		const dialogRef = this.dialog.open(CadastroVendaComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.venda.ID_VENDA = 0;
			if (result) {
				this.getVendaLista();
			}
		});
	}
	getVendaLista(): void {
		this.vendasService
			.getVendasCliente(this.venda.ID_CLIENTE)
			.subscribe((data: { query: string; json: Array<VendasLista> }) => {
				if (data.json.length > 0) {
					this.vendasLista = data.json;
				} else {
					this.vendasLista = [];
				}
			});
	}
	selectCliente(item: string): void {
		const obj = this.comboClientes.find(el => el.LABEL === item);
		this.venda.ID_CLIENTE = obj.VALOR;
		this.venda.NM_CLIENTE = obj.LABEL;
		this.getVendaLista();
	}
	novoCliente(): void {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		// dialogConfig.data = { status: status, message: message };
		const dialogRef = this.dialog.open(CadastroClienteComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		});
	}
	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboClientes
						.filter(
							v =>
								v.LABEL.toLowerCase().indexOf(
									term.toLowerCase()
								) > -1
						)
						.slice(0, 10)
						.map(s => s.LABEL)
			)
		)

	formatter = (LABEL: string) => LABEL;

}

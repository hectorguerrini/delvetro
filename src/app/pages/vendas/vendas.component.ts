import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VendasService } from './vendas.service';
import { vendasLista } from 'src/app/models/vendasLista';
import { CadastroVendaComponent } from '../cadastro-venda/cadastro-venda.component';
interface cliente{	
	id_cliente: number,
	nome: string
}
@Component({
	selector: 'app-vendas',
	templateUrl: './vendas.component.html',
	styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

	comboClientes: Array<Combo> = [];
	vendasLista: Array<vendasLista> = [];	
	cliente: cliente = {
		id_cliente: null,
		nome: ''
	};
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private vendasService: VendasService,
		private dialog: MatDialog
	) {
		appService
			.getCombo('clientes')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboClientes = data.json;
			});
	}

	ngOnInit() {		
	}
	novaVenda(): void{
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		dialogConfig.data = this.cliente;
		const dialogRef = this.dialog.open(CadastroVendaComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
		});
	}
	selectCliente(item: string): void {
		const obj = this.comboClientes.find(el => el.LABEL === item);
		this.cliente.id_cliente = obj.VALOR;
		this.cliente.nome = obj.LABEL;
		this.vendasService
			.getVendasCliente(obj.VALOR)
			.subscribe((data: { query: string; json: Array<vendasLista> }) => {
				if (data.json.length > 0) {
					this.vendasLista = data.json;
				} else {
					this.vendasLista = [];
				}
			});
	}
	novoCliente(): void {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
		dialogConfig.panelClass = 'model-cadastro';
		//dialogConfig.data = { status: status, message: message };
		const dialogRef = this.dialog.open(CadastroClienteComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
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
						.slice(0, 5)
						.map(s => s.LABEL)
			)
		)

	formatter = (LABEL: string) => LABEL;

}

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { VendasService } from '../vendas/vendas.service';
import { MessageComponent } from 'src/app/dialogs/message/message.component';
import { OrcamentoComponent } from 'src/app/dialogs/orcamento/orcamento.component';
interface Cliente {
	id_cliente: number;
	nome: string;
}
@Component({
	selector: 'app-cadastro-venda',
	templateUrl: './cadastro-venda.component.html',
	styleUrls: ['./cadastro-venda.component.scss']
})
export class CadastroVendaComponent implements OnInit {
	submittedProduto = false;
	// submittedPagamento = false;
	submittedExtras = false;
	submitted = false;
	openExtra = -1;
	itensForm: FormGroup = this.fb.group({
		ID_SERVICO: [null],
		TIPO: [''],
		NM_PRODUTO: ['', Validators.required],
		QTDE: [null, Validators.required],
		LARGURA: [''],
		ALTURA: [''],
		CUSTO: [''],
	});
	// pagamentoForm: FormGroup = this.fb.group({
	// 	ID_FORMA_PGT: [''],
	// 	NM_FORMA_PGT: [''],
	// 	DT_PGTO: [null, Validators.required],
	// 	VL_PGTO: ['', Validators.required]
	// });
	extraForm: FormGroup = this.fb.group({
		ID_SERVICO: [null],
		ID_ITEM_VENDIDO: [''],
		DESCRICAO: ['', Validators.required],
		QUANTIDADE: ['', Validators.required],
		CUSTO: ['']
	});
	vendaForm: FormGroup = this.fb.group({
		ID_CLIENTE: ['', Validators.required],
		NM_CLIENTE: ['', Validators.required],
		CUSTO: [0],
		ITENS: this.fb.array([]),
		PGTO: this.fb.array([])
	});
	comboProdutos: Array<Combo>;
	comboFormaPgto: Array<Combo>;
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private vendasService: VendasService,
		public dialogRef: MatDialogRef<CadastroVendaComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: Cliente
	) {
		appService
			.getCombo('produtos_vendas')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboProdutos = data.json;
			});
		appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
			});
		this.vendaForm.controls['ID_CLIENTE'].setValue(data.id_cliente);
		this.vendaForm.controls['NM_CLIENTE'].setValue(data.nome);
	}

	ngOnInit() {

	}
	onChanges(): void {

	}
	openServicosExtras(index: number): void {
		this.openExtra = this.openExtra === index ? -1 : index;
	}
	popup(status, message) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '260px';
		dialogConfig.data = { status: status, message: message };
		const dialogRef = this.dialog.open(MessageComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {
			this.submitted = false;
		});
	}
	orcamento(): void {
		const json = Object.assign({}, this.vendaForm.value);
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		dialogConfig.data = json;
		const dialogRef = this.dialog.open(OrcamentoComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {});
	}

	salvarVenda(): void {

		const venda = {};

		const json = Object.assign(venda, this.vendaForm.value);
		json.PGTO.forEach(el => {
			el.VL_PGTO = el.VL_PGTO.replace(',', '.');

		});
		console.log('Venda ', json);

		// this.vendasService.salvarVenda(json)
		// 	.subscribe((data: {query: string, json: Array<any>}) => {
		// 		console.log(data.json);
		// 	});

	}
	selectProduto(item: string): void {
		const obj = this.comboProdutos.find(el => el.LABEL === item);
		this.itensForm.setValue({
			ID_SERVICO: obj.VALOR,
			NM_PRODUTO: obj.LABEL,
			CUSTO: obj.CUSTO,
			TIPO: obj.TIPO,
			QTDE: 1,
			LARGURA: 100,
			ALTURA: 100

		});

	}
	calculoCustoVenda(): void {



	}
	// addPagamento(): void {
	// 	this.submittedPagamento = true;
	// 	if (this.pagamentoForm.invalid) {
	// 		return;
	// 	}

	// 	const composicao = this.vendaForm.get('PGTO') as FormArray;
	// 	const obj = this.pagamentoForm.value;

	// 	const nm_forma_pgto = this.comboFormaPgto.find(el => el.VALOR === obj.ID_FORMA_PGT).LABEL;
	// 	const pgto: FormGroup = this.fb.group({
	// 		ID_FORMA_PGT: [obj.ID_FORMA_PGT],
	// 		NM_FORMA_PGT: [nm_forma_pgto],
	// 		DT_PGTO: [obj.DT_PGTO],
	// 		VL_PGTO: [obj.VL_PGTO]
	// 	});

	// 	composicao.push(pgto);
	// 	this.submittedPagamento = false;
	// 	this.pagamentoForm.reset();

	// }
	// rmPagamento(i: number): void {
	// 	const composicao = this.vendaForm.get('PGTO') as FormArray;
	// 	composicao.removeAt(i);
	// }
	addProduto(): void {
		this.submittedProduto = true;
		if (this.itensForm.invalid) {
			return;
		}
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		const obj = this.itensForm.value;

		const itens: FormGroup = this.fb.group({
			ID: [obj.ID],
			TIPO: [obj.TIPO],
			NM_PRODUTO: [obj.NM_PRODUTO],
			QTDE: [obj.QTDE],
			LARGURA: [obj.LARGURA],
			ALTURA: [obj.ALTURA],
			CUSTO: [obj.CUSTO],
			EXTRAS: this.fb.array([])
		});

		composicao.push(itens);
		this.submittedProduto = false;
		this.itensForm.reset();

	}
	rmProduto(i: number): void {
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		composicao.removeAt(i);
	}
	addServicosExtras(id: number): void {
		this.submittedExtras = true;
		if (this.extraForm.invalid) {
			return;
		}
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		const compExtras = composicao.controls[id].get('EXTRAS') as FormArray;

		const obj = this.extraForm.value;
		console.log(obj);
		const extras: FormGroup = this.fb.group({
			ID_SERVICO: [null],
			ID_ITEM_VENDIDO: [null],
			DESCRICAO: [obj.DESCRICAO],
			QUANTIDADE: [obj.QUANTIDADE],
			CUSTO: ['']
		});

		compExtras.push(extras);
		this.submittedExtras = false;
		this.extraForm.reset();
		console.log(this.vendaForm);
	}
	rmServicosExtras(id: number, i: number): void {
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		const compExtras = composicao.controls[id].get('EXTRAS') as FormArray;
		compExtras.removeAt(i);
	}



	searchProdutos = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboProdutos
						.filter(v => v.LABEL.toLowerCase().indexOf(term.toLowerCase()) > -1 && v.TIPO !== 'Servico')
						.slice(0, 5)
						.map(s => s.LABEL)
			)
		)
	searchServicos = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboProdutos
						.filter(v => v.LABEL.toLowerCase().indexOf(term.toLowerCase()) > -1 && v.TIPO === 'Servico')
						.slice(0, 5)
						.map(s => s.LABEL)
			)
		)
	formatter = (LABEL: string) => LABEL;
}

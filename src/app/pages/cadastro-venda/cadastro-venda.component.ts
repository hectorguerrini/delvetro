import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { VendasService } from '../vendas/vendas.service';
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
	submittedPagamento = false;
	submittedExtras = false;
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
	pagamentoForm: FormGroup = this.fb.group({
		ID_FORMA_PGT: [''],
		DT_PGTO: [null, Validators.required],
		VL_PGTO: ['', Validators.required]
	});
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
		CUSTO: [''],
		ITENS: this.fb.array([]),
		PGTO: this.fb.array([])
	});
	comboProdutos: Array<Combo>;
	comboFormaPgto: Array<Combo>;
	comboServicos: Array<Combo>;
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private vendasService: VendasService,
		public dialogRef: MatDialogRef<CadastroVendaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Cliente
	) {
		appService
			.getCombo('produtos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboProdutos = data.json;
			});
		appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
			});
		appService
			.getCombo('servicos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboServicos = data.json;
			});
		this.vendaForm.controls['ID_CLIENTE'].setValue(data.id_cliente);
		this.vendaForm.controls['NM_CLIENTE'].setValue(data.nome);
	}

	ngOnInit() {
		this.onChanges();
	}
	onChanges(): void {
		this.pagamentoForm.get('VL_PGTO')
			.valueChanges.pipe(distinctUntilChanged())
			.subscribe(custo => {
				let valor = '0,00';
				if (custo) {
					valor = custo
						.replace(/\D/g, '')
						.replace(/((\d{1,2})$)/g, ',$2')
						.replace(/(^(0)+)/g, '');
					valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				}

				this.pagamentoForm
					.get('VL_PGTO')
					.setValue(valor);
				this.pagamentoForm
					.get('VL_PGTO')
					.updateValueAndValidity();
			}
		);
	}
	openServicosExtras(index: number): void {
		this.openExtra = this.openExtra === index ? -1 : index;
	}

	salvarVenda(): void {
		const venda = {};

		const json = Object.assign(venda, this.vendaForm.value);
		console.log('Venda ', json);
		this.vendasService.salvarVenda(json)
			.subscribe((data: {query: string, json: Array<any>}) => {
				console.log(data.json);
			});

	}
	addPagamento(): void {
		this.submittedPagamento = true;
		if (this.pagamentoForm.invalid) {
			return;
		}

		const composicao = this.vendaForm.get('PGTO') as FormArray;
		const obj = this.pagamentoForm.value;
		const pgto: FormGroup = this.fb.group({
			ID_FORMA_PGT: [obj.ID_FORMA_PGT],
			DT_PGTO: [obj.DT_PGTO],
			VL_PGTO: [obj.VL_PGTO]
		});

		composicao.push(pgto);
		this.submittedPagamento = false;
		this.pagamentoForm.reset();

	}
	rmPagamento(i: number): void {
		const composicao = this.vendaForm.get('PGTO') as FormArray;
		composicao.removeAt(i);
	}
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
	searchServicos = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboServicos
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

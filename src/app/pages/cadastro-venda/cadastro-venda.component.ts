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
import { Venda } from 'src/app/models/venda';
interface Cliente {
	id_cliente: number;
	nome: string;
}
class Calculo {
	qtde: number;
	altura: number;
	largura: number;
	area: number;
	altura_considerada: number;
	largura_considerada: number;
	area_considerada: number;
	valor: number;
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
		ID_PRODUTO: [null],
		TIPO: [''],
		UNIDADE: [''],
		NM_PRODUTO: ['', Validators.required],
		QTDE: [null, Validators.required],
		LARGURA: [''],
		ALTURA: [''],		
		PRECO_FINAL: [''],
		PRECO_UNITARIO: ['']
	});
	// pagamentoForm: FormGroup = this.fb.group({
	// 	ID_FORMA_PGT: [''],
	// 	NM_FORMA_PGT: [''],
	// 	DT_PGTO: [null, Validators.required],
	// 	VL_PGTO: ['', Validators.required]
	// });
	extraForm: FormGroup = this.fb.group({
		ID_PRODUTO: [null],
		ID_ITEM_VENDIDO: [''],
		DESCRICAO: ['', Validators.required],
		QUANTIDADE: ['', Validators.required],
		PRECO_FINAL: [''],
		PRECO_UNITARIO: ['']
	});
	vendaForm: FormGroup = this.fb.group({
		ID_CLIENTE: ['', Validators.required],
		NM_CLIENTE: ['', Validators.required],
		PRECO_FINAL: [0],
		STATUS_VENDA: ['Nova Venda'],
		ITENS: this.fb.array([])
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

	calculoPrecoFinal(valor: number, soma: boolean): void {			
		const preco = soma ? this.vendaForm.get('PRECO_FINAL').value + valor : this.vendaForm.get('PRECO_FINAL').value - valor;
		this.vendaForm.get('PRECO_FINAL').setValue(preco);
		this.vendaForm
					.get('PRECO_FINAL')
					.updateValueAndValidity();
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

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.vendaForm.get('STATUS_VENDA').setValue('Orçamento');
				this.salvarVenda();
			}
		});
	}

	salvarVenda(): void {

		let venda = <Venda>{};

		venda = Object.assign(venda, this.vendaForm.value);		
		venda.QTD_PRODUTOS = venda.ITENS.length;
		venda.PRODUTOS = [];
		venda.ITENS.forEach(el => {			
			if (el.TIPO === 'Chaparia') {
				const qtde = el.QTDE*1;
				for(let i = 0; i < qtde; i++) {
					const obj = Object.assign({}, el);
					obj.PRECO_FINAL = el.PRECO_FINAL / qtde;
					obj.QTDE = 1;
					venda.PRODUTOS.push(obj);
				}
			} else {
				venda.PRODUTOS.push(el);
			}
		})
		console.log('Venda ', venda);

		this.vendasService.salvarVenda(venda)
			.subscribe((data: {query: string, json: Array<any>}) => {
				if (data.json.length > 0) {
					this.popup('success', 'Cadastro Efetuado com sucesso');
					this.dialogRef.close(true);
				} else {
					this.popup('error', 'Error no cadastro');
				}
			});

	}
	selectProduto(item: string): void {
		const obj = this.comboProdutos.find(el => el.LABEL === item);
		this.itensForm.setValue({
			ID_PRODUTO: obj.VALOR,
			NM_PRODUTO: obj.LABEL,
			PRECO_UNITARIO: obj.PRECO,
			PRECO_FINAL: obj.PRECO,
			TIPO: obj.TIPO,
			UNIDADE: obj.UNIDADE,
			QTDE: 1,
			LARGURA: obj.TIPO === 'Chaparia' ? 1000 : null,
			ALTURA: obj.TIPO === 'Chaparia' ? 1000 : null
		});
		this.onChangesCalc();
	}
	onChangesCalc(): void {
		
		if ( this.itensForm.get('TIPO').value === 'Chaparia' ) {
			this.itensForm.get('QTDE')
				.valueChanges
				.subscribe(el => {
					const calculo = this.calculoCustoVenda();
					this.itensForm.get('PRECO_FINAL').setValue(calculo.valor);
					this.itensForm
						.get('PRECO_FINAL')
						.updateValueAndValidity();
			})
			this.itensForm.get('ALTURA')
				.valueChanges
				.subscribe(el => {
					const calculo = this.calculoCustoVenda();
					this.itensForm.get('PRECO_FINAL').setValue(calculo.valor);
					this.itensForm
						.get('PRECO_FINAL')
						.updateValueAndValidity();
			})
			this.itensForm.get('LARGURA')
				.valueChanges
				.subscribe(el => {
					const calculo = this.calculoCustoVenda();
					this.itensForm.get('PRECO_FINAL').setValue(calculo.valor);
					this.itensForm
						.get('PRECO_FINAL')
						.updateValueAndValidity();
			})
		} else {
			this.itensForm.get('QTDE')
				.valueChanges
				.subscribe(el => {
					const valor = this.itensForm.get('PRECO_UNITARIO').value * el;
					this.itensForm.get('PRECO_FINAL').setValue(valor);
					this.itensForm
						.get('PRECO_FINAL')
						.updateValueAndValidity();
			})
		}
		
	}
	calculoCustoVenda(): Calculo {
		let calculo = new Calculo();
		calculo.valor = 0;
		if (this.itensForm.get('UNIDADE').value === 'Metro Quadrado') {
			calculo.altura = this.itensForm.get('ALTURA').value*1;
			calculo.largura = this.itensForm.get('LARGURA').value*1;
			calculo.qtde = this.itensForm.get('QTDE').value*1;
			
			calculo.area = (calculo.largura * calculo.altura)/1000000;

			calculo.altura_considerada = Math.ceil(calculo.altura / 5)*5;
			calculo.largura_considerada = Math.ceil(calculo.largura / 5)*5;

			calculo.area_considerada = Math.max(((calculo.altura_considerada * calculo.largura_considerada)/1000000),0.25);

			calculo.valor = calculo.qtde * (calculo.area_considerada * this.itensForm.get('PRECO_UNITARIO').value);
			
			console.log(`
				altura: ${calculo.altura}
				largura: ${calculo.largura}
				area: ${calculo.area}

				altura considerada: ${calculo.altura_considerada}
				largura considerada: ${calculo.largura_considerada}
				area considerada: ${calculo.area_considerada}

				valor: ${calculo.valor}
			`)
		}
		

		return calculo;
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
		const calculo = this.calculoCustoVenda();
		const itens: FormGroup = this.fb.group({
			ID_PRODUTO: [obj.ID_PRODUTO],
			TIPO: [obj.TIPO],
			NM_PRODUTO: [obj.NM_PRODUTO],
			QTDE: [obj.QTDE],
			LARGURA: [obj.LARGURA],
			ALTURA: [obj.ALTURA],
			AREA: [calculo.area],
			LARGURA_CONSIDERADA: [calculo.largura_considerada],
			ALTURA_CONSIDERADA: [calculo.altura_considerada],
			AREA_CONSIDERADA: [calculo.area_considerada],
			PRECO_FINAL: [obj.PRECO_FINAL],
			PRECO_UNITARIO: [obj.PRECO_UNITARIO],
			EXTRAS: this.fb.array([])
		});

		composicao.push(itens);
		this.submittedProduto = false;
		this.itensForm.reset();		
		this.calculoPrecoFinal(obj.PRECO_FINAL, true);
		
	}
	rmProduto(i: number): void {		
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		this.calculoPrecoFinal(composicao.controls[i].get('PRECO_FINAL').value, false);
		composicao.removeAt(i);		
	}	
	selectServicosExtras(item: string): void {
		const obj = this.comboProdutos.find(el => el.LABEL === item);
		this.extraForm.setValue({
			ID_PRODUTO: obj.VALOR,
			ID_ITEM_VENDIDO: null,
			DESCRICAO: obj.LABEL,
			QUANTIDADE: 1,
			PRECO_FINAL: obj.PRECO,
			PRECO_UNITARIO: obj.PRECO
		});
		this.extraForm.get('QUANTIDADE')
			.valueChanges
			.subscribe(el => {
				const valor = el * this.extraForm.get('PRECO_UNITARIO').value;

				this.extraForm.get('PRECO_FINAL').setValue(valor);
				this.extraForm
					.get('PRECO_FINAL')
					.updateValueAndValidity();
			})
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
			ID_PRODUTO: [obj.ID_PRODUTO],
			ID_ITEM_VENDIDO: [null],
			DESCRICAO: [obj.DESCRICAO],
			QUANTIDADE: [obj.QUANTIDADE],
			PRECO_FINAL: [obj.PRECO_FINAL]
		});

		compExtras.push(extras);
		this.submittedExtras = false;
		this.extraForm.reset();
		this.calculoPrecoFinal(obj.PRECO_FINAL, true);
	}
	rmServicosExtras(id: number, i: number): void {
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		const compExtras = composicao.controls[id].get('EXTRAS') as FormArray;
		this.calculoPrecoFinal(compExtras.controls[i].get('PRECO_FINAL').value, false);
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

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
interface cliente{	
	id_cliente: number,
	nome: string
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
	openExtra: number = -1;
  	itensForm: FormGroup = this.fb.group({
		ID: [null],		
		TIPO: [''],
		NM_PRODUTO: ['', Validators.required],
		QTDE: [null, Validators.required],
		LARGURA: [''],
		ALTURA: [''],
		CUSTO: [''],		
	});
	pagamentoForm: FormGroup = this.fb.group({
		ID: [null, Validators.required],		
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
		public dialogRef: MatDialogRef<CadastroVendaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: cliente
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
		
	}
	addPagamento(): void{

	}
	addProduto(): void{
		this.submittedProduto = true;		
		if(this.itensForm.invalid){
			return;
		}
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		const obj = this.itensForm.value;
		composicao.push(this.fb.group({
			ID: [obj.ID],		
			TIPO: [obj.TIPO],
			NM_PRODUTO: [obj.NM_PRODUTO],
			QTDE: [obj.QTDE],
			LARGURA: [obj.LARGURA],
			ALTURA: [obj.ALTURA],
			CUSTO: [obj.CUSTO],
			EXTRAS: this.fb.array([])
		}));
		console.log(this.vendaForm)
	}
	rmProduto(i: number): void {
		const composicao = this.vendaForm.get('ITENS') as FormArray;
		composicao.removeAt(i);		
	}
	addServicosExtras(id: number): void{
		this.submittedExtras = true;
			
		if(this.extraForm.invalid){
			return;
		}
		const composicao = this.vendaForm.controls['ITENS'] as FormArray;
		const compExtras = composicao.controls[id].get('EXTRAS').value as FormArray;
		const obj = this.extraForm.value;
		compExtras.push(this.fb.group({
			ID_SERVICO: [null],		
			ID_ITEM_VENDIDO: [null],		
			DESCRICAO: [obj.DESCRICAO],		
			QUANTIDADE: [obj.QUANTIDADE],
			CUSTO: ['']
		}))
		console.log(this.vendaForm)
	}
	rmServicosExtras(id: number,i: number): void {
		const composicao = this.vendaForm.get('ITENS').value as FormArray;
		composicao[id].EXTRAS.removeAt(i);		
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

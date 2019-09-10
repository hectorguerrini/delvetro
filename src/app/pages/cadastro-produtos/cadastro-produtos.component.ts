import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from 'src/app/core/services/app.service';
import { Combo } from 'src/app/shared/models/combo';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { CadastroServicosService } from '../cadastro-servicos/cadastro-servicos.service';
import { CadastroEstoqueService } from '../cadastro-estoque/cadastro-estoque.service';
import { CadastroProdutosService } from './cadastro-produtos.service';
import { Produto } from 'src/app/shared/models/produto';
import { Estoque } from 'src/app/shared/models/estoque';
import { Servico } from 'src/app/shared/models/servico';
import { MessageComponent } from 'src/app/core/dialogs/message/message.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-cadastro-produtos',
	templateUrl: './cadastro-produtos.component.html',
	styleUrls: ['./cadastro-produtos.component.scss']
})
export class CadastroProdutosComponent implements OnInit {
	submitted = false;
	submitted2 = false;

	produtosForm: FormGroup = this.fb.group({
		ID_PRODUTO: [null],
		NM_PRODUTO: ['', Validators.required],
		UNIDADE_VENDA: ['', Validators.required],
		PRECO_UNITARIO: ['0,00', Validators.required],
		PRZ_ENTREGA: [''],
		CUSTO: [''],
		TIPO: ['', Validators.required],
		COMPOSICAO: this.fb.array([])
	});
	composicaoForm: FormGroup = this.fb.group({
		TIPO: ['Serviço'],
		ID: [null],
		DESCRICAO: [null, Validators.required],
		QTDE_UTILIZADA: [null],
		CUSTO: ['']
	});
	comboServicos: Array<Combo> = [];
	comboEstoque: Array<Combo> = [];
	comboProdutos: Array<Combo> = [];
	composicao: any = {};

	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private servicoService: CadastroServicosService,
		private estoqueService: CadastroEstoqueService,
		private produtoService: CadastroProdutosService,
		private dialog: MatDialog
	) {
		this.appService
			.getCombo('servicos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboServicos = data.json;
			});
		this.appService
			.getCombo('estoque')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboEstoque = data.json;
			});
		this.appService
			.getCombo('produtos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboProdutos = data.json;
			});
	}

	ngOnInit() {
		this.onChange();
	}

	onChange() {
		this.composicaoForm
			.get('TIPO')
			.valueChanges
			.subscribe(el => {
				this.composicaoForm.get('DESCRICAO').setValue('');
				this.composicaoForm
					.get('DESCRICAO')
					.updateValueAndValidity();
				this.composicaoForm.get('ID').setValue(null);
				this.composicaoForm
					.get('ID')
					.updateValueAndValidity();
				if (this.composicaoForm.get('TIPO').value === 'Estoque') {
					this.composicaoForm.get('QTDE_UTILIZADA').setValidators([Validators.required]);
				} else {
					this.composicaoForm.get('QTDE_UTILIZADA').setValidators(null);
				}
				this.composicaoForm.get('QTDE_UTILIZADA').updateValueAndValidity();

			});
		this.composicaoForm
			.get('QTDE_UTILIZADA')
			.valueChanges
			.subscribe(el => {
				const valor = this.composicao.CUSTO ? this.composicao.CUSTO * el : 0;
				this.composicaoForm.get('CUSTO').setValue(valor);
				this.composicaoForm
					.get('CUSTO')
					.updateValueAndValidity();

			});
		this.produtosForm
			.get('PRECO_UNITARIO')
			.valueChanges.pipe(distinctUntilChanged())
			.subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				this.produtosForm
					.get('PRECO_UNITARIO')
					.setValue(valor);
				this.produtosForm
					.get('PRECO_UNITARIO')
					.updateValueAndValidity();
			});


	}

	selectProduto(item: string): void {
		const obj = this.comboProdutos.find(el => el.LABEL === item);
		this.produtosForm.get('ID_PRODUTO').setValue(obj.VALOR);
		this.produtoService
			.getProduto(obj.VALOR)
			.subscribe((data: { query: string; json: Array<Produto> }) => {
				if (data.json.length > 0) {
					const json = data.json[0];
					this.produtosForm.patchValue(json);
					const composicao = this.produtosForm.get('COMPOSICAO') as FormArray;
					json.COMPOSICAO.forEach( obj => {
						composicao.push(this.fb.group({
							TIPO: [obj.TIPO],
							ID: [obj.ID],
							DESCRICAO: [obj.DESCRICAO, Validators.required],
							QTDE_UTILIZADA: [obj.QTDE_UTILIZADA],
							CUSTO: [obj.CUSTO]
						}));
					});

					this.produtosForm.controls['NM_PRODUTO'].disable();
				}
			});
	}
	rmComposicao(i: number): void {
		const composicao = this.produtosForm.get('COMPOSICAO') as FormArray;
		composicao.removeAt(i);
		let total = 0;
		composicao.value.map(el => {
			total += el.CUSTO;
		});
		this.produtosForm.get('CUSTO').setValue(total);
	}
	addComposicao(): void {
		this.submitted2 = true;
		if ( this.composicaoForm.invalid ) {
			return;
		}
		const composicao = this.produtosForm.get('COMPOSICAO') as FormArray;
		const obj = this.composicaoForm.value;
		composicao.push(this.fb.group({
			TIPO: [obj.TIPO],
			ID: [obj.ID],
			DESCRICAO: [obj.DESCRICAO, Validators.required],
			QTDE_UTILIZADA: [obj.QTDE_UTILIZADA],
			CUSTO: [obj.CUSTO]
		}));
		let total = 0;
		composicao.value.map(el => {
			total += el.CUSTO;
		});
		this.produtosForm.get('CUSTO').setValue(total);
		this.composicaoForm.reset({
			TIPO: 'Serviço'
		});
		this.submitted2 = false;
		this.composicao = {};
	}
	submitProdutos(): void {
		this.submitted = true;
		if (this.produtosForm.invalid) {
			return;
		}

		const produto = new Produto();
		const json = Object.assign(produto, this.produtosForm.value);
		json.PRECO_UNITARIO = json.PRECO_UNITARIO.replace(
			',',
			'.'
		);
		json.NM_PRODUTO = json.NM_PRODUTO ? json.NM_PRODUTO.toUpperCase() : '';
		this.produtoService
			.cadastroProdutos(json)
			.subscribe((data: { query: string; json: Array<Produto> }) => {
				if (data.json.length > 0) {
					this.popup('success', 'Cadastro Efetuado com sucesso');
				} else {
					this.popup('error', 'Error no cadastro do produto');
				}
			});
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

	selectComposicao(item: string): void {

		if ( this.composicaoForm.get('TIPO').value === 'Serviço' ) {
			const obj = this.comboServicos.find(el => el.LABEL === item);
			this.composicaoForm.get('ID').setValue(obj.VALOR);
			this.servicoService
				.getServico(obj.VALOR)
				.subscribe((data: { query: string; json: Array<Servico> }) => {
					if (data.json.length > 0) {
						this.composicao = data.json[0];
						this.composicao.CUSTO = data.json[0].CUSTO_POR_UNIDADE;
						this.composicaoForm.get('CUSTO').setValue(this.composicao.CUSTO);
						this.composicaoForm
							.get('CUSTO')
							.updateValueAndValidity();
					}
				});
		} else {
			const obj = this.comboEstoque.find(el => el.LABEL === item);
			this.composicaoForm.get('ID').setValue(obj.VALOR);
			this.estoqueService
				.getServico(obj.VALOR)
				.subscribe((data: { query: string; json: Array<Estoque> }) => {
					if (data.json.length > 0) {
						this.composicao = data.json[0];
						this.composicao.CUSTO = data.json[0].CUSTO_ULTIMO_RECEBIMENTO;
					}
				});
		}


	}

	resetForm(): void {
		this.produtosForm.controls['NM_PRODUTO'].enable();
		const composicao = this.produtosForm.get('COMPOSICAO') as FormArray;
		console.log(composicao.length);
		for (let i = 0; i <= composicao.length; i++) {
			composicao.removeAt(0);
		}

		this.produtosForm.reset({
			PRECO_UNITARIO: '0,00'
		});
	}
	searchComposicao = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: (this.composicaoForm.get('TIPO').value === 'Serviço' ? this.comboServicos : this.comboEstoque)
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

	search = (text$: Observable<string>) =>
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
	formatter = (LABEL: string) => LABEL;
}

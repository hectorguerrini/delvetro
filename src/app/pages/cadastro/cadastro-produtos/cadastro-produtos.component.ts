// Core
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

// Services
import { AppService } from 'src/app/core/services/app.service';
import { CadastroService } from 'src/app/pages/cadastro/cadastro.service';

// Models
import { Combo } from 'src/app/shared/models/combo';
import { Estoque } from 'src/app/shared/models/estoque';
import { Produto } from 'src/app/shared/models/produto';
import { Servico } from 'src/app/shared/models/servico';

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
		ID: [null, Validators.required],
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
		private cadastroService: CadastroService
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
					.setValue(valor, { emitEvent: false });
				this.produtosForm
					.get('PRECO_UNITARIO')
					.updateValueAndValidity();
			});


	}

	selectProduto(item: string): void {
		const obj = this.comboProdutos.find(el => el.LABEL === item);
		this.produtosForm.get('ID_PRODUTO').setValue(obj.VALOR);
		this.cadastroService
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

		let produto: Produto;
		produto = this.produtosForm.value;
		produto.PRECO_UNITARIO = produto.PRECO_UNITARIO.replace(',', '.');
		produto.NM_PRODUTO = produto.NM_PRODUTO ? produto.NM_PRODUTO.toUpperCase() : '';
		this.cadastroService
			.salvarProduto(produto)
			.subscribe((data: { query: string; json: Array<Produto> }) => {
				this.submitted = false;
				if (data.json.length > 0) {
					this.appService.popup('success', 'Cadastro Efetuado com sucesso');
					this.resetForm();
				} else {
					this.appService.popup('error', 'Error no cadastro do produto');
				}
			});
	}

	selectComposicao(item: string): void {

		if ( this.composicaoForm.get('TIPO').value === 'Serviço' ) {
			const obj = this.comboServicos.find(el => el.LABEL === item);
			this.composicaoForm.get('ID').setValue(obj.VALOR);
			this.cadastroService
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
			this.cadastroService
				.getEstoque(obj.VALOR)
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

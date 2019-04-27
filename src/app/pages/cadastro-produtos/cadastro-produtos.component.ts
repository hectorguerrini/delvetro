import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CadastroServicosService } from '../cadastro-servicos/cadastro-servicos.service';
import { Servico } from 'src/app/models/servico';
import { CadastroEstoqueService } from '../cadastro-estoque/cadastro-estoque.service';
import { Estoque } from 'src/app/models/estoque';

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
		DESCRICAO: ['', Validators.required],
		UNIDADE_VENDA: ['', Validators.required],
		PRECO_UNITARIO: ['0,00', Validators.required],
		PRZ_ENTREGA: [''],
		CUSTO: [''],
		COMPOSICAO: this.fb.array([])
	});
	composicaoForm: FormGroup = this.fb.group({
		TIPO: ['Serviço'],
		ID: [null],
		DESCRICAO: [null, Validators.required],
		QTDE_UTILIZADA: [null, Validators.required],
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
		private estoqueService: CadastroEstoqueService
	) {
		appService
			.getCombo('servicos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboServicos = data.json;
			});
		appService
			.getCombo('estoque')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboEstoque = data.json;
			});
		appService
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
			QTDE_UTILIZADA: [obj.QTDE_UTILIZADA, Validators.required],
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

// Core
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';

// Services
import { AppService } from 'src/app/core/services/app.service';
import { CadastroService } from 'src/app/pages/cadastro/cadastro.service';

// Models
import { Combo } from 'src/app/shared/models/combo';
import { Estoque } from 'src/app/shared/models/estoque';


@Component({
	selector: 'app-cadastro-estoque',
	templateUrl: './cadastro-estoque.component.html',
	styleUrls: ['./cadastro-estoque.component.scss']
})
export class CadastroEstoqueComponent implements OnInit {
	submitted = false;
	estoqueForm: FormGroup = this.fb.group({
		ID_ESTOQUE: [null],
		ID_TIPO: ['', Validators.required],
		DESCRICAO: ['', Validators.required],
		QTDE: [0],
		UNIDADE: ['Unitario', Validators.required],
		ESPESSURA: [0],
		LOCALIZACAO: [''],
		ESTOQUE_MIN: [0, Validators.required],
		ESTOQUE_MAX: [0, Validators.required],
		CUSTO_ULTIMO_RECEBIMENTO: ['0,00']
	});
	comboTiposEstoque: Array<Combo>;
	comboEstoque: Array<Combo>;

	constructor(
		private fb: FormBuilder,
		private cadastroService: CadastroService,
		private appService: AppService
	) {
		this.appService
			.getCombo('tipo_estoque')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboTiposEstoque = data.json;
			});
		this.appService
			.getCombo('estoque')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboEstoque = data.json;
			});
	}

	ngOnInit() {
		this.onChanges();
	}
	onChanges(): void {
		this.estoqueForm.get('ID_TIPO').valueChanges.subscribe(tipo => {
			if (tipo === 1) {
				this.estoqueForm
					.get('ESPESSURA')
					.setValidators([Validators.required]);
			} else {
				this.estoqueForm.get('ESPESSURA').setValidators(null);
			}
			this.estoqueForm.get('ESPESSURA').updateValueAndValidity();
		});
		this.estoqueForm
			.get('CUSTO_ULTIMO_RECEBIMENTO')
			.valueChanges.pipe(distinctUntilChanged())
			.subscribe(custo => {
				let valor = '0,00';
				if (typeof (custo) === 'number') {
					custo = custo.toFixed(2);
				}
				if (custo) {
					valor = custo
						.replace(/\D/g, '')
						.replace(/((\d{1,2})$)/g, ',$2')
						.replace(/(^(0)+)/g, '');
					valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				}

				this.estoqueForm
					.get('CUSTO_ULTIMO_RECEBIMENTO')
					.setValue(valor, { emitEvent: false });
				this.estoqueForm
					.get('CUSTO_ULTIMO_RECEBIMENTO')
					.updateValueAndValidity();
			});
	}
	submitEstoque(): void {
		this.submitted = true;
		if (this.estoqueForm.invalid) {
			return;
		}

		let estoque: Estoque;
		estoque = this.estoqueForm.value;
		estoque.CUSTO_ULTIMO_RECEBIMENTO = estoque.CUSTO_ULTIMO_RECEBIMENTO.replace(',', '.');
		estoque.DESCRICAO = estoque.DESCRICAO ? estoque.DESCRICAO.toUpperCase() : '';
		this.cadastroService
			.salvarEstoque(estoque)
			.subscribe((data: { query: string; json: Array<Estoque> }) => {
				this.submitted = false;
				if (data.json.length > 0) {
					this.appService.popup('success', 'Cadastro Efetuado com sucesso');
					this.resetForm();
				} else {
					this.appService.popup('error', 'Error no cadastro');
				}
			});
	}
	selectEstoque(item: string): void {
		const obj = this.comboEstoque.find(el => el.LABEL === item);
		this.estoqueForm.get('ID_ESTOQUE').setValue(obj.VALOR);
		this.cadastroService
			.getEstoque(obj.VALOR)
			.subscribe((data: { query: string; json: Array<Estoque> }) => {
				if (data.json.length > 0) {
					this.estoqueForm.patchValue(data.json[0]);
					this.estoqueForm.controls['DESCRICAO'].disable();
				}
			});
	}
	resetForm(): void {
		this.estoqueForm.controls['DESCRICAO'].enable();
		this.estoqueForm.reset({
			CUSTO_ULTIMO_RECEBIMENTO: '0,00',
			UNIDADE: 'Unitario',
			ESTOQUE_MIN: 0,
			ESTOQUE_MAX: 0,
			QTDE: 0
		});
	}
	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboEstoque
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

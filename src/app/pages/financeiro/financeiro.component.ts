import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Combo } from 'src/app/shared/models/combo';
import { AppService } from 'src/app/core/services/app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil, debounceTime, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import { Despesa } from 'src/app/shared/models/despesa';
import { FinanceiroService } from './financeiro.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-financeiro',
	templateUrl: './financeiro.component.html',
	styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit, OnDestroy {
	submitted = false;
	despesaForm: FormGroup = this.fb.group({
		ID_DESPESA: [null],
		NM_DESPESA: ['', Validators.required],
		VL_DESPESA: ['0,00'],
		ID_CATEGORIA: [null, Validators.required],
		ID_BENEFICIADO: [null, Validators.required],
		DT_VENCIMENTO: [moment(), Validators.required],
		DT_PGTO: [null],
		ID_FORMA_PGTO: [1, Validators.required],
		STATUS_PGTO: [null, Validators.required]
	});

	comboBeneficiados: Array<Combo>;
	comboFormaPgto: Array<Combo>;
	comboCategoria: Array<Combo>;
	comboDespesas: Array<Combo>;
	unsubscription = new Subject<void>();
	constructor(
		private fb: FormBuilder,		
		private appService: AppService,
		private financeiroService: FinanceiroService,
		@Inject(MAT_DIALOG_DATA) public ID_DESPESA: number
	) {
		this.appService
			.getCombo('beneficiados')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboBeneficiados = data.json;
			});
		this.appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
			});
		this.appService
			.getCombo('categoria_despesa')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboCategoria = data.json;
			});
		this.appService
			.getCombo('despesas')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboDespesas = data.json;
			});
	}

	ngOnInit() {
		if (this.ID_DESPESA) {
			console.log(this.ID_DESPESA)
			this.getDespesa(this.ID_DESPESA);
		}
		this.onChanges();
	}
	ngOnDestroy() {
		this.unsubscription.next();
		this.unsubscription.complete();
	}
	onChanges(): void {
		this.despesaForm
			.get('VL_DESPESA')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscription)
			).subscribe(custo => {
				if (typeof(custo) === 'number') {
					custo = custo.toFixed(2);
				}
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				this.despesaForm.get('VL_DESPESA').setValue(valor, {emitEvent: false});
				this.despesaForm
					.get('VL_DESPESA')
					.updateValueAndValidity();
			});
	}
	selectDespesa(item): void {
		const obj = this.comboDespesas.find(el => el.LABEL === item);
		this.despesaForm.get('ID_DESPESA').setValue(obj.VALOR);
		this.getDespesa(obj.VALOR);
	}
	getDespesa(ID_DESPESA: number): void {
		this.financeiroService.getDespesa(ID_DESPESA)
			.subscribe((data: { query: string; json: Array<Despesa> }) => {
				if (data.json.length > 0 ) {
					this.despesaForm.patchValue(data.json[0]);
				}
			});
	}
	salvarDespesa(): void {
		this.submitted = true;
		if (this.despesaForm.invalid) {
			return;
		}

		const despesa: Despesa = Object.assign({}, this.despesaForm.value);
		despesa.VL_DESPESA = despesa.VL_DESPESA.replace(',', '.');

		this.financeiroService.salvarDespesa(despesa)
			.subscribe((data: { query: string; json: Array<Despesa> }) => {
				if (data.json.length > 0) {
					this.appService.popup('success', 'Cadastro Despesa efetuado com sucesso');
					this.resetForm();
				} else {
					this.appService.popup('error', 'Error no cadastro');
				}
			});

		this.submitted = false;
	}
	resetForm(): void {
		this.despesaForm.reset({
			VL_DESPESA: '0,00',
			DT_VENCIMENTO: moment(),
			ID_FORMA_PGTO: 1
		});
	}
	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboDespesas
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

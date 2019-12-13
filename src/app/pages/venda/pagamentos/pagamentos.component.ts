import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/core/services/app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venda } from 'src/app/shared/models/venda';
import { Combo } from 'src/app/shared/models/combo';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { VendaService } from '../venda.service';
import { Pagamento } from 'src/app/shared/models/pagamento';
import { detalheVenda } from 'src/app/shared/models/detalhe-venda';

@Component({
	selector: 'app-pagamentos',
	templateUrl: './pagamentos.component.html',
	styleUrls: ['./pagamentos.component.scss']
})
export class PagamentosComponent implements OnInit, OnDestroy {

	pgtoForm: FormGroup = this.fb.group({
		ID_FORMA_PGTO: [1, Validators.required],
		NM_FORMA_PGTO: [''],
		DT_PGTO: [moment(), Validators.required],
		VL_PGTO: ['0,00', Validators.required],
		VL_PGTO_CONSID: ['0,00', Validators.required]
	});
	pagamentoForm: FormGroup = this.fb.group({
		ID_CLIENTE: ['', Validators.required],
		ID_VENDA: ['', Validators.required],
		DESCONTO: [0],
		CREDITO_CONSUMO: [0],
		VL_TOTAL: [0],
		VL_PAGO_TOTAL: [0],
		PGTO: this.fb.array([])
	});
	comboFormaPgto: Array<Combo> = [];
	unsubscription = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		public dialogRef: MatDialogRef<PagamentosComponent>,		
		private vendaService: VendaService,
		@Inject(MAT_DIALOG_DATA) public data: Venda
	) {
		this.appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
				this.comboFormaPgto.map(el => {
					el.PRECO = el.TIPO === 'Debito' ? 1.05 : el.TIPO === 'Credito' ? 1.1 : 1;
				});
			});
	}

	ngOnInit() {
		this.vendaService.getVendaCliente(this.data.ID_CLIENTE, this.data.ID_VENDA)
			.subscribe((data: { query: string; json: Array<detalheVenda> }) => {
				if (data.json.length > 0 ) {
					this.pagamentoForm.get('CREDITO_CONSUMO').setValue(data.json[0].CREDITO_CONSUMO);
					this.pagamentoForm.get('VL_TOTAL').setValue(data.json[0].VL_TOTAL);
					this.pagamentoForm.get('VL_PAGO_TOTAL').setValue(data.json[0].VL_PAGO_TOTAL);
				}

			});
		this.pagamentoForm.get('ID_CLIENTE').setValue(this.data.ID_CLIENTE);
		this.pagamentoForm.get('ID_VENDA').setValue(this.data.ID_VENDA);
		this.onChange();
	}
	ngOnDestroy() {
		this.unsubscription.next();
		this.unsubscription.complete();
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
	calculoValor(valor, taxa): number {
		return valor * taxa;
	}

	onChange(): void {
		this.pgtoForm
			.get('ID_FORMA_PGTO')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscription)
			).subscribe(el => {
				let custo = this.pgtoForm.get('VL_PGTO').value;
				custo = custo.replace(',', '.');

				const forma_pgto = this.comboFormaPgto.find(pg => pg.VALOR === el);
				const valor = `${this.calculoValor(custo, forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;

				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor);
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();
			});
	}

	salvarPagamento(): void {
		let pagamento: Pagamento;
		pagamento = this.pagamentoForm.value;
		this.vendaService.salvarPagamento(pagamento)
			.subscribe((data: {query: string, json: Array<Pagamento>}) => {
				if (data.json.length > 0) {
					this.appService.popup('success', 'Pagamento Efetuado com sucesso');
					this.dialogRef.close(true);
				} else {
					this.appService.popup('error', 'Error no cadastro');
				}
			});


	}
	addPagamento(): void {

		if (this.pgtoForm.invalid) {
			return;
		}

		const composicao = this.pagamentoForm.get('PGTO') as FormArray;
		const obj = this.pgtoForm.value;
		const vl_pgto = this.appService.convertLabeltoNumber(obj.VL_PGTO);
		const vl_pgto_consid = this.appService.convertLabeltoNumber(obj.VL_PGTO_CONSID);
		const pgto: FormGroup = this.fb.group({
			ID_FORMA_PGTO: [obj.ID_FORMA_PGTO],
			NM_FORMA_PGTO: [this.comboFormaPgto.find(el => el.VALOR === obj.ID_FORMA_PGTO).LABEL],
			DT_PGTO: [obj.DT_PGTO],
			VL_PGTO: [vl_pgto],
			VL_PGTO_CONSID: [vl_pgto_consid]
		});

		composicao.push(pgto);

		if (this.pgtoForm.get('ID_FORMA_PGTO').value === 5 ) {
			this.pagamentoForm.get('CREDITO_CONSUMO').setValue(this.pagamentoForm.get('CREDITO_CONSUMO').value - vl_pgto);
		}

		const vl_pgto_total = Math.ceil((this.pagamentoForm.get('VL_PAGO_TOTAL').value + vl_pgto) * 100) / 100;
		if (vl_pgto_total <= this.pagamentoForm.get('VL_TOTAL').value ) {
			this.pagamentoForm.get('VL_PAGO_TOTAL').setValue(vl_pgto_total);
		} else {
			const vl_aberto = vl_pgto_total - this.pagamentoForm.get('VL_TOTAL').value;
			this.appService.popup('info', `Valor de pagamento maior que o em aberto. Gerado saldo de R$ ${vl_aberto.toFixed(2)} em Credito Consumo`);
			this.pagamentoForm.get('VL_PAGO_TOTAL').setValue(this.pagamentoForm.get('VL_TOTAL').value);
			this.pagamentoForm.get('CREDITO_CONSUMO').setValue(vl_aberto + this.pagamentoForm.get('CREDITO_CONSUMO').value);
		}


		this.pgtoForm.reset({
			ID_FORMA_PGTO: 1,
			DT_PGTO: moment(),
			VL_PGTO: '0,00',
			VL_PGTO_CONSID: '0,00',
		});
	}

	rmPagamento(i: number): void {
		const composicao = this.pagamentoForm.get('PGTO') as FormArray;
		composicao.removeAt(i);
	}
	vlTotalChange(): void {
		this.pgtoForm
			.get('VL_PGTO')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscription)
			).subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;

				let valor_real = this.appService.convertLabeltoNumber(valor);
				const forma_pgto = this.comboFormaPgto.find(el => el.VALOR === this.pgtoForm.get('ID_FORMA_PGTO').value);
				if (this.pgtoForm.get('ID_FORMA_PGTO').value === 5 ) {
					if (valor_real > this.pagamentoForm.get('CREDITO_CONSUMO').value) {
						valor_real =  this.pagamentoForm.get('CREDITO_CONSUMO').value;
						valor = `${(valor_real * forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;
					}
				}

				const valor_final = `${(valor_real * forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;

				this.pgtoForm.get('VL_PGTO').setValue(valor, {emitEvent: false});
				this.pgtoForm
					.get('VL_PGTO')
					.updateValueAndValidity();

				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor_final, {emitEvent: false});
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();
			});
	}
	vlConsidChange(): void {
		this.pgtoForm
			.get('VL_PGTO_CONSID')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscription)
			).subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				let valor_real = this.appService.convertLabeltoNumber(valor);
				const forma_pgto = this.comboFormaPgto.find(el => el.VALOR === this.pgtoForm.get('ID_FORMA_PGTO').value);
				if (this.pgtoForm.get('ID_FORMA_PGTO').value === 5 ) {
					if (valor_real > this.pagamentoForm.get('CREDITO_CONSUMO').value) {
						valor_real =  this.pagamentoForm.get('CREDITO_CONSUMO').value;
						valor = valor_real;
					}
				}
				const valor_final = `${(valor_real / forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;
				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor , {emitEvent: false});
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();

				this.pgtoForm.get('VL_PGTO').setValue(valor_final, {emitEvent: false});
				this.pgtoForm
					.get('VL_PGTO')
					.updateValueAndValidity();
			});
	}
	setDate(event: MatDatepickerInputEvent<Date>): void {
		console.log(event);
		console.log(this.pgtoForm);
	}
}

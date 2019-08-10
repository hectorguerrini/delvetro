import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venda } from 'src/app/models/venda';
import { Combo } from 'src/app/models/combo';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
	selector: 'app-pagamentos',
	templateUrl: './pagamentos.component.html',
	styleUrls: ['./pagamentos.component.scss']
})
export class PagamentosComponent implements OnInit {

	pgtoForm: FormGroup = this.fb.group({
		ID_FORMA_PGTO: [1, Validators.required],
		NM_FORMA_PGTO: [''],
		DESCONTO: [0],
		DT_PGTO: [moment(), Validators.required],
		VL_PGTO: ['0,00', Validators.required],
		VL_PGTO_CONSID: ['0,00', Validators.required]
	})
	pagamentoForm: FormGroup = this.fb.group({
		ID_CLIENTE: ['', Validators.required],
		ID_VENDA: ['', Validators.required],
		PGTO: this.fb.array([])
	});
	comboFormaPgto: Array<Combo> = [];
	unsubscriptionTotal = new Subject<void>();
	unsubscriptionConsid = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		public dialogRef: MatDialogRef<PagamentosComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: Venda
	) {
		appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
				this.comboFormaPgto.map(el => {
					el.PRECO = el.TIPO === 'Debito' ? 1.05 : el.TIPO === 'Credito' ? 1.1 : 1;
				})
			});
	}

	ngOnInit() {
		this.pagamentoForm.get('ID_CLIENTE').setValue(this.data.ID_CLIENTE);
		this.pagamentoForm.get('ID_VENDA').setValue(this.data.ID_VENDA);
		this.onChange();
	}
	calculoValor(valor, taxa, desconto): number {
		return (valor - (valor*desconto/100)) * taxa 
	}
	onChange(): void {
		this.pgtoForm
			.get('ID_FORMA_PGTO')
			.valueChanges.pipe(distinctUntilChanged())
			.subscribe(el => {
				let custo = this.pgtoForm.get('VL_PGTO').value;
				custo = custo.replace(',','.');
				const desconto = this.pgtoForm.get('DESCONTO').value;
				const forma_pgto = this.comboFormaPgto.find(pg => pg.VALOR === el);
				const valor = `${this.calculoValor(custo, forma_pgto.PRECO, desconto).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;				

				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor);
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();
			})
	}

	addPagamento(): void {

		if (this.pgtoForm.invalid) {
			return;
		}

		const composicao = this.pagamentoForm.get('PGTO') as FormArray;
		const obj = this.pgtoForm.value;

		const pgto: FormGroup = this.fb.group({
			ID_FORMA_PGTO: [obj.ID_FORMA_PGTO],
			NM_FORMA_PGTO: [this.comboFormaPgto.find(el => el.VALOR === obj.ID_FORMA_PGTO).LABEL],
			DESCONTO: [obj.DESCONTO],
			DT_PGTO: [obj.DT_PGTO],
			VL_PGTO: [obj.VL_PGTO],
			VL_PGTO_CONSID: [obj.VL_PGTO_CONSID]
		});

		composicao.push(pgto);

		this.pgtoForm.reset({
			ID_FORMA_PGTO: 1,
			DT_PGTO: moment(),
			DESCONTO: 0,
			VL_PGTO: '0,00',
			VL_PGTO_CONSID: '0,00',
		});
	}

	rmPagamento(i: number): void {
		const composicao = this.pagamentoForm.get('PGTO') as FormArray;
		composicao.removeAt(i);
	}
	vlTotalChange(): void {
		this.unsubscriptionConsid.next();
		this.unsubscriptionConsid.complete();
		if (this.unsubscriptionTotal.isStopped) {
			this.unsubscriptionTotal = new Subject<void>();
		}
		this.pgtoForm
			.get('VL_PGTO')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscriptionTotal)
			).subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;

				const valor_real = valor.replace(',', '.');
				const forma_pgto = this.comboFormaPgto.find(el => el.VALOR === this.pgtoForm.get('ID_FORMA_PGTO').value);
				const valor_final = `${(valor_real * forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;

				this.pgtoForm.get('VL_PGTO').setValue(valor);
				this.pgtoForm
					.get('VL_PGTO')
					.updateValueAndValidity();

				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor_final);
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();
			});
	}
	vlConsidChange(): void {
		this.unsubscriptionTotal.next();
		this.unsubscriptionTotal.complete();
		if (this.unsubscriptionTotal.isStopped) {
			this.unsubscriptionConsid = new Subject<void>();
		}
		this.pgtoForm
			.get('VL_PGTO_CONSID')
			.valueChanges.pipe(
				distinctUntilChanged(),
				takeUntil(this.unsubscriptionConsid)
			).subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				const valor_real = valor.replace(',', '.');
				const forma_pgto = this.comboFormaPgto.find(el => el.VALOR === this.pgtoForm.get('ID_FORMA_PGTO').value);
				const valor_final = `${(valor_real / forma_pgto.PRECO).toFixed(2).replace('.', ',').replace(/^(\D)/g, '0$1')}`;
				this.pgtoForm.get('VL_PGTO_CONSID').setValue(valor);
				this.pgtoForm
					.get('VL_PGTO_CONSID')
					.updateValueAndValidity();

				this.pgtoForm.get('VL_PGTO').setValue(valor_final);
				this.pgtoForm
					.get('VL_PGTO')
					.updateValueAndValidity();
			});
	}
	setDate(event: MatDatepickerInputEvent<Date>): void {
		console.log(event);
		console.log(this.pgtoForm)
	}
}

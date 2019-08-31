import { Component, OnInit, OnDestroy } from '@angular/core';
import { Combo } from 'src/app/models/combo';
import { AppService } from 'src/app/app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Despesa } from 'src/app/models/despesa';
import { FinanceiroService } from './financeiro.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/dialogs/message/message.component';
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
	unsubscription = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		private dialog: MatDialog,
		private appService: AppService,
		private financeiroService: FinanceiroService
	) {
		appService
			.getCombo('beneficiados')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboBeneficiados = data.json;
			});
		appService
			.getCombo('formas_pagamento')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboFormaPgto = data.json;
			});
		appService
			.getCombo('categoria_despesa')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboCategoria = data.json;
			});
	}

	ngOnInit() {
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
					this.popup('success', 'Cadastro Despesa efetuado com sucesso');
					this.resetForm();
				} else {
					this.popup('error', 'Error no cadastro');
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
}

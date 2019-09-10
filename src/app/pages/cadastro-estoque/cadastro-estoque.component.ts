import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { Combo } from 'src/app/shared/models/combo';
import { CadastroEstoqueService } from './cadastro-estoque.service';
import { Estoque } from 'src/app/shared/models/estoque';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/core/dialogs/message/message.component';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/core/services/app.service';
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
		private estoqueService: CadastroEstoqueService,
		private dialog: MatDialog,
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
				if (custo) {
					valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
					valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				}

				this.estoqueForm
					.get('CUSTO_ULTIMO_RECEBIMENTO')
					.setValue(valor);
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

		const estoque = new Estoque();
		const json = Object.assign(estoque, this.estoqueForm.value);
		json.CUSTO_ULTIMO_RECEBIMENTO = json.CUSTO_ULTIMO_RECEBIMENTO.replace(
			',',
			'.'
		)*1;
		json.DESCRICAO = json.DESCRICAO ? json.DESCRICAO.toUpperCase() : json.DESCRICAO;
		this.estoqueService
			.cadastroEstoque(json)
			.subscribe((data: { query: string; json: Array<Estoque> }) => {
				if (data.json.length > 0) {
					this.popup('success', 'Cadastro Efetuado com sucesso');
					this.resetForm();
				} else {
					this.popup('error', 'Error no cadastro');
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

	selectCliente(item: string): void {
		const obj = this.comboEstoque.find(el => el.LABEL === item);
		this.estoqueForm.get('ID_ESTOQUE').setValue(obj.VALOR);
		this.estoqueService
			.getServico(obj.VALOR)
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

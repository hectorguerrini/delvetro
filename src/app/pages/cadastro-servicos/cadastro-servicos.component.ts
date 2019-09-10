import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/core/services/app.service';
import { Combo } from 'src/app/shared/models/combo';
import { CadastroServicosService } from './cadastro-servicos.service';
import { Servico } from 'src/app/shared/models/servico';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/core/dialogs/message/message.component';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-cadastro-servicos',
	templateUrl: './cadastro-servicos.component.html',
	styleUrls: ['./cadastro-servicos.component.scss']
})
export class CadastroServicosComponent implements OnInit {
	submitted = false;
	servicosForm: FormGroup = this.fb.group({
		ID_SERVICO: [null],
		ID_TIPO: ['', Validators.required],
		UNIDADE_CUSTO: ['', Validators.required],
		CUSTO_POR_UNIDADE: ['0,00', Validators.required],
		PRZ_CONCLUSAO: [''],
		OBS: [''],
		ID_BENEFICIADO: ['', Validators.required],
		DESCRICAO: ['', Validators.required],
		EXTERNO: ['', Validators.required]
	});
	comboTipo: Array<Combo> = [];
	comboBeneficiados: Array<Combo> = [];
	comboServicos: Array<Combo> = [];
	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private servicoService: CadastroServicosService,
		private dialog: MatDialog
	) {
		this.appService
			.getCombo('tipo_servicos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboTipo = data.json;
			});
		this.appService
			.getCombo('beneficiados')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboBeneficiados = data.json;
			});
		this.appService
			.getCombo('servicos')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboServicos = data.json;
			});
	}

	ngOnInit() {
		this.onChanges();
	}
	onChanges(): void {
		this.servicosForm
			.get('CUSTO_POR_UNIDADE')
			.valueChanges.pipe(distinctUntilChanged())
			.subscribe(custo => {
				let valor = custo
					.replace(/\D/g, '')
					.replace(/((\d{1,2})$)/g, ',$2')
					.replace(/(^(0)+)/g, '');
				valor = `${valor.replace(/^(\D)/g, '0$1')}`;
				this.servicosForm.get('CUSTO_POR_UNIDADE').setValue(valor);
				this.servicosForm
					.get('CUSTO_POR_UNIDADE')
					.updateValueAndValidity();
			});
	}
	submitServicos(): void {
		this.submitted = true;
		if (this.servicosForm.invalid) {
			return;
		}
		const servico = new Servico();
		const json = Object.assign(servico, this.servicosForm.value);
		json.CUSTO_POR_UNIDADE = json.CUSTO_POR_UNIDADE.replace(',', '.');
		json.DESCRICAO = json.DESCRICAO ? json.DESCRICAO.toUpperCase() : '';
		this.servicoService
			.cadastroServico(json)
			.subscribe((data: { query: string; json: Array<Servico> }) => {
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
		const obj = this.comboServicos.find(el => el.LABEL === item);
		this.servicosForm.get('ID_SERVICO').setValue(obj.VALOR);
		this.servicoService
			.getServico(obj.VALOR)
			.subscribe((data: { query: string; json: Array<Servico> }) => {
				if (data.json.length > 0) {
					this.servicosForm.patchValue(data.json[0]);
					this.servicosForm.controls['DESCRICAO'].disable();
				}
			});
	}
	resetForm(): void {
		this.servicosForm.controls['DESCRICAO'].enable();
		this.servicosForm.reset({
			CUSTO_POR_UNIDADE: '0,00'
		});
	}
	search = (text$: Observable<string>) =>
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

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CadastroClienteService } from './cadastro-cliente.service';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from 'src/app/dialogs/message/message.component';
import { Combo } from '../../models/combo';
import { AppService } from 'src/app/app.service';

@Component({
	selector: 'app-cadastro-cliente',
	templateUrl: './cadastro-cliente.component.html',
	styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit {
	submitted = false;
	telefoneForm: FormGroup = this.fb.group({
		ID_TELEFONE_CLIENTE: [''],
		TELEFONE: ['']
	})
	clienteForm: FormGroup = this.fb.group({
		ID_CLIENTE: [''],
		NM_CLIENTE: ['', Validators.required],
		RAZAO_SOCIAL: ['', Validators.required],
		ENDERECO: ['', Validators.required],
		NUMERO: ['', Validators.required],
		BAIRRO: ['', Validators.required],
		CIDADE: ['', Validators.required],
		CEP: ['', Validators.required],
		ESTADO: ['', Validators.required],
		EMAIL: ['', Validators.required],
		TELEFONES: this.fb.array([
			this.telefonesForm(),
			this.telefonesForm(),
			this.telefonesForm()
		]),
		NM_CONTATO: ['', Validators.required],
		LOJISTA: ['', Validators.required],
		RG: ['', Validators.required],
		CPF: ['', Validators.required],
		COMPLEMENTO: ['']
	});
	
	comboClientes: Array<Combo> = [];
	constructor(
		private fb: FormBuilder,
		private cadastroService: CadastroClienteService,
		private appService: AppService,
		private dialog: MatDialog
	) {
		appService
			.getCombo('clientes')
			.subscribe((data: { query: string; json: Array<Combo> }) => {
				this.comboClientes = data.json;
			});
	}

	ngOnInit() {
		this.onChanges();
	}
	onChanges(): void {
		this.clienteForm.get('CEP').valueChanges.subscribe(cep => {
			if (cep.length === 8) {
				this.cadastroService.getCEP(cep).subscribe((data: any) => {
					this.clienteForm.get('CEP').setValue(data.cep);
					this.clienteForm.get('ENDERECO').setValue(data.logradouro);
					this.clienteForm.get('CIDADE').setValue(data.localidade);
					this.clienteForm.get('ESTADO').setValue(data.uf);
					this.clienteForm.get('BAIRRO').setValue(data.bairro);
				});
			}
		});
	}
	telefonesForm(): FormGroup {
		return this.fb.group({
			ID_TELEFONE_CLIENTE: [''],
			TELEFONE: ['']
		})
	}
	selectCliente(item: string): void {
		const obj = this.comboClientes.find(el => el.LABEL === item);
		this.clienteForm.get('ID_CLIENTE').setValue(obj.VALOR);
		this.cadastroService
			.getCliente(obj.VALOR)
			.subscribe((data: { query: string; json: Array<Cliente> }) => {
				if (data.json.length > 0) {
					let res = data.json[0];
					res.TELEFONES = res.TELEFONES ? JSON.parse(res.TELEFONES) : []
					this.clienteForm.patchValue(res);					
					this.clienteForm.controls['NM_CLIENTE'].disable();
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
	submitCliente(): void {
		this.submitted = true;
		if (this.clienteForm.invalid) {
			return;
		}
		const cliente = new Cliente();
		const json = Object.assign(cliente, this.clienteForm.value);
		json.LOJISTA = json.LOJISTA * 1;
		this.cadastroService
			.cadastroCliente(json)
			.subscribe((data: { query: string; json: Array<Cliente> }) => {
				if (data.json.length > 0) {
					this.popup('success', 'Cadastro Efetuado com sucesso');
					this.resetForm();
				} else {
					this.popup('erro', 'Error no cadastro');
				}
			});
	}
	resetForm(): void{
		this.clienteForm.controls['NM_CLIENTE'].enable();
		this.clienteForm.reset();
	}
	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map(term =>
				term === ''
					? []
					: this.comboClientes
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

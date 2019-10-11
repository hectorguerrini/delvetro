// Core
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// Services
import { AppService } from 'src/app/core/services/app.service';
import { CadastroService } from 'src/app/core/services/cadastro.service';

// Models
import { Combo } from '../../../shared/models/combo';
import { Cliente } from 'src/app/shared/models/cliente';



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
	});
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
		COMPLEMENTO: [null]
	});

	comboClientes: Array<Combo> = [];

	constructor(
		private fb: FormBuilder,
		private cadastroService: CadastroService,
		private appService: AppService
	) {
		this.appService
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
		});
	}
	selectCliente(item: string): void {
		const obj = this.comboClientes.find(el => el.LABEL === item);
		this.clienteForm.get('ID_CLIENTE').setValue(obj.VALOR);
		this.cadastroService
			.getCliente(obj.VALOR)
			.subscribe((data: { query: string; json: Array<Cliente> }) => {
				if (data.json.length > 0) {
					const res = data.json[0];
					this.clienteForm.patchValue(res, { emitEvent: false });
					this.clienteForm.controls['NM_CLIENTE'].disable();
				}
			});
	}
	submitCliente(): void {
		this.submitted = true;
		if (this.clienteForm.invalid) {
			return;
		}
		let cliente: Cliente;
		cliente = this.clienteForm.value;
		cliente.LOJISTA = cliente.LOJISTA * 1;

		this.cadastroService
			.salvarCliente(cliente)
			.subscribe((data: { query: string; json: Array<Cliente> }) => {
				this.submitted = false;
				if (data.json.length > 0) {
					this.appService.popup('success', 'Cadastro Efetuado com sucesso');
					this.resetForm();
				} else {
					this.appService.popup('error', 'Error no cadastro');
				}
			});
	}
	resetForm(): void {
		this.clienteForm.controls['NM_CLIENTE'].enable();
		this.clienteForm.reset({}, {emitEvent: false});
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

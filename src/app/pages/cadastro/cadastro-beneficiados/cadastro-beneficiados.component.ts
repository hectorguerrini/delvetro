import { Component, OnInit } from '@angular/core';
import { Beneficiados } from '../../../shared/models/beneficiados';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/core/services/app.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { CadastroService } from 'src/app/pages/cadastro/cadastro.service';
@Component({
	selector: 'app-cadastro-beneficiados',
	templateUrl: './cadastro-beneficiados.component.html',
	styleUrls: ['./cadastro-beneficiados.component.scss']
})
export class CadastroBeneficiadosComponent implements OnInit {
	submitted = false;
	beneficiadoForm: FormGroup = this.fb.group({
		ID_BENEFICIADO: [null],
		ID_FUNCIONARIO: [null],
		NM_BENEFICIADO: ['', Validators.required],
		TIPO_BENEFICIADO: ['', Validators.required],
		CPF: ['', Validators.required],
		CNPJ: ['', Validators.required],
		RAZAO_SOCIAL: ['', Validators.required],
		RG: ['', Validators.required],
		CARGO: ['', Validators.required],
		SUPERVISOR: ['', Validators.required],
		USUARIO: ['', Validators.required],
		SENHA: ['', Validators.required],
		SALARIO: ['', Validators.required],
		DT_CONTRATACAO: ['']
	});

	constructor(
		private fb: FormBuilder,
		private appService: AppService,
		private cadastroService: CadastroService,

	) { }

	ngOnInit() {
		this.onChange();
	}

	onChange(): void {
		this.beneficiadoForm.get('TIPO_BENEFICIADO')
			.valueChanges
			.pipe(distinctUntilChanged())
			.subscribe(tipo => {
				if (tipo === 'Funcionario') {
					this.beneficiadoForm.get('RG').setValidators([Validators.required]);
					this.beneficiadoForm.get('SUPERVISOR').setValidators([Validators.required]);
					this.beneficiadoForm.get('CARGO').setValidators([Validators.required]);
					this.beneficiadoForm.get('USUARIO').setValidators([Validators.required]);
					this.beneficiadoForm.get('SENHA').setValidators([Validators.required]);
					this.beneficiadoForm.get('SALARIO').setValidators([Validators.required]);

					this.beneficiadoForm.get('RG').updateValueAndValidity();
					this.beneficiadoForm.get('SUPERVISOR').updateValueAndValidity();
					this.beneficiadoForm.get('CARGO').updateValueAndValidity();
					this.beneficiadoForm.get('USUARIO').updateValueAndValidity();
					this.beneficiadoForm.get('SENHA').updateValueAndValidity();
					this.beneficiadoForm.get('SALARIO').updateValueAndValidity();
				} else {
					this.beneficiadoForm.get('RG').setValidators(null);
					this.beneficiadoForm.get('SUPERVISOR').setValidators(null);
					this.beneficiadoForm.get('CARGO').setValidators(null);
					this.beneficiadoForm.get('USUARIO').setValidators(null);
					this.beneficiadoForm.get('SENHA').setValidators(null);
					this.beneficiadoForm.get('SALARIO').setValidators(null);

					this.beneficiadoForm.get('RG').updateValueAndValidity();
					this.beneficiadoForm.get('SUPERVISOR').updateValueAndValidity();
					this.beneficiadoForm.get('CARGO').updateValueAndValidity();
					this.beneficiadoForm.get('USUARIO').updateValueAndValidity();
					this.beneficiadoForm.get('SENHA').updateValueAndValidity();
					this.beneficiadoForm.get('SALARIO').updateValueAndValidity();
				}

			});


	}
	salvarBeneficiado(): void {
		this.submitted = true;

		if (this.beneficiadoForm.invalid) {
			return;
		}
		let beneficiado: Beneficiados;
		beneficiado = this.beneficiadoForm.value;
		this.cadastroService.salvarBeneficiado(beneficiado)
		.subscribe((data: { query: string; json: Array<Beneficiados> }) => {
			this.submitted = false;
			if (data.json.length > 0) {
				this.appService.popup('success', 'Cadastro Beneficiado Efetuado com sucesso ');
				this.resetForm();
			} else {
				this.appService.popup('error', 'Error no cadastro');
			}
		});
	}
	resetForm(): void {
		this.beneficiadoForm.reset();
	}
}

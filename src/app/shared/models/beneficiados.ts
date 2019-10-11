export class Funcionarios {
	ID_FUNCIONARIO: number;
	NM_FUNCIONARIO: string;
	RG: string;
	CARGO: string;
	SUPERVISOR: number;
	USUARIO: string;
	SENHA: string;
	CPF: string;
	SALARIO: number;
	DT_CONTRATACAO: string;
	SALDO_FERIAS: number;
	DT_VENCIMENTO_FERIAS: string;
}

export class Beneficiados extends Funcionarios {
	ID_BENEFICIADO: number;
	NM_BENEFICIADO: string;
	TIPO_BENEFICIADO: string;
	CPF: string;
	CNPJ: string;
	RAZAO_SOCIAL: string;
}

export interface AttQtdeEstoque {
	ID_ESTOQUE: number;
	MOTIVO: string;
	VALOR: number;
}

export interface LogEstoque {
	ID_LOG_ESTOQUE: number;
	DT_ALTERACAO: string;
	MOTIVO: string;
	DELTA: number;
	ID_FUNCIONARIO: number;
}

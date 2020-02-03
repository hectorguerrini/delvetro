export interface attQtdeEstoque {
	ID_ESTOQUE: number;
	MOTIVO: string;
	VALOR: number;	
}

export interface logEstoque {
	ID_LOG_ESTOQUE: number;
	DT_ALTERACAO: string;
	MOTIVO: string;
	DELTA: number;
	ID_FUNCIONARIO: number;
}
export interface Estoque {
	ID_ESTOQUE: number;
	ID_TIPO: number;
	DESCRICAO: string;
	QTDE: number;
	UNIDADE: string;
	ESPESSURA: number;
	LOCALIZACAO: string;
	ESTOQUE_MIN: number;
	ESTOQUE_MAX: number;
	CUSTO_ULTIMO_RECEBIMENTO: string;
}
export interface ControleEstoque {
	ID_ESTOQUE: number;
	DESCRICAO: string;
	QTDE: number;
	LOCALIZACAO: string;
	ESTOQUE_MIN: number;
	ESTOQUE_MAX: number;
	ID_TIPO: number;
	TIPO: string;
	CUSTO_ULTIMO_RECEBIMENTO: string;
}
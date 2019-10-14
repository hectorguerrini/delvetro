export interface ComposicaoProduto {
	ID: number;
	TIPO: string;
	DESCRICAO: string;
	QTDE_UTILIZADA: number;
	CUSTO: number;
}


export interface Produto {
	ID_PRODUTO: number;
	NM_PRODUTO: string;
	UNIDADE_VENDA: string;
	PRECO_UNITARIO: string;
	PRZ_ENTREGA: string;
	CUSTO: number;
	TIPO: string;
	COMPOSICAO: Array<ComposicaoProduto>;
}

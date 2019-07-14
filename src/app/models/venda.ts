interface ServicosExtras {
	ID_SERVICO: number;
	ID_ITEM_VENDIDO: number;
	DESCRICAO: string;
	QUANTIDADE: number;
	CUSTO: string;
}

interface Pagamento {
	ID_FORMA_PGT: number;
	NM_FORMA_PGT: string;
	DT_PGTO: string;
	VL_PGTO: number;

}

interface ItensVendidos {
	ID_SERVICO: number;
	TIPO: string;
	NM_PRODUTO: string;
	QTDE: number;
	LARGURA: number;
	ALTURA: number;
	CUSTO: string;
	EXTRAS: Array<ServicosExtras>;
}

export interface Venda {
	ID_VENDA: number;
	ID_CLIENTE: number;
	NM_CLIENTE: string;
	CUSTO: string;
	ITENS: Array<ItensVendidos>;
	PGTO: Array<Pagamento>;
}

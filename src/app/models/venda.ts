interface ServicosExtras {
	ID_PRODUTO: number;
	ID_ITEM_VENDIDO: number;
	DESCRICAO: string;
	QUANTIDADE: number;
	PRECO_FINAL: string;
}

// interface Pagamento {
// 	ID_FORMA_PGT: number;
// 	NM_FORMA_PGT: string;
// 	DT_PGTO: string;
// 	VL_PGTO: number;
// }

interface ItensVendidos {
	ID_PRODUTO: number;
	TIPO: string;
	NM_PRODUTO: string;
	QTDE: number;
	LARGURA: number;
	ALTURA: number;
	PRECO_FINAL: number;
	EXTRAS: Array<ServicosExtras>;
}

export interface Venda {
	ID_VENDA: number;
	ID_CLIENTE: number;
	NM_CLIENTE: string;
	PRECO_FINAL: number;
	STATUS_VENDA: string;
	QTD_PRODUTOS: number;
	ITENS: Array<ItensVendidos>;
	PRODUTOS: Array<ItensVendidos>;
	// PGTO: Array<Pagamento>;
}

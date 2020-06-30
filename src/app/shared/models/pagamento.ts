export interface FormaPgto {
	ID_FORMA_PGTO: number;
	NM_FORMA_PGTO: number;
	DT_PGTO: string;
	VL_PGTO: number;
	VL_PGTO_CONSID: number;
}
export interface Pagamento {
	ID_CLIENTE: number;
	ID_VENDA: number;
	DESCONTO: number;
	CREDITO_CONSUMO: number;
	VL_TOTAL: number;
	VL_PAGO_TOTAL: number;
	PGTO: Array<FormaPgto>;
}

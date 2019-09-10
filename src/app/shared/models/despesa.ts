export interface Despesa {
	ID_DESPESA: number;
	NM_DESPESA: string;
	VL_DESPESA: string;
	ID_CATEGORIA: number;
	ID_BENEFICIADO: number;
	DT_VENCIMENTO: string;
	DT_PGTO: string;
	ID_FORMA_PGTO: number;
	STATUS_PGTO: string;
}

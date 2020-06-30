export interface ColunaTipoData {
	tipo: string;
	valorMin: null;
	valorMax: null;
	filter?: boolean;
}
export interface ColunaTipoString {
	tipo: string;
	valor: string;
}
export interface ColunaTipoDinheiro {
	tipo: string;
	valor: string;
}
export interface ColunaTipoCombo {
	tipo: string;
	valor: number;
}
export interface ModelTabela {
	ID: number;
	COLUNA1: string;
	COLUNA2: string;
	COLUNA3: string;
	COLUNA4: string;
	COLUNA5: number;
	COLUNA6: string;
	COLUNA7: string;
}
export interface valoresTotal {
	valorTotal: number;
}

export interface filtro {
	tipo?: string;
	valor?: any;
	valorMin?: any;
	valorMax?: any;
	filter?: boolean;
}
export interface filtroItens {
	ID: filtro;
	Cliente: filtro;
	Descricao: filtro;
	Dt_venda: filtro;
	Status: filtro;
	Financeiro: filtro;
}
export interface filtroEstoque {
	ID: filtro;
	Descricao: filtro;
	Localizacao: filtro;
	Qtde: filtro;
	Estoque_min: filtro;
	Estoque_max: filtro;
	Tipo: filtro;
}
export class Tabela {
	public nome: string;
	public colspan: Number;
	public filtros: Array<filtro>;
	public total: valoresTotal;
	constructor(nome: string, size: Number) {
		this.nome = nome;
		this.colspan = size;
		this.filtros = [];
		this.total = {
			valorTotal: 0
		};
	}
	addCol(
		tipo: string,
		valorMin?: any,
		valorMax?: any,
		filter?: boolean
	): void {
		if (tipo === 's') {
			const obj = <ColunaTipoString>{};
			obj.tipo = tipo;
			obj.valor = '';
			this.filtros.push(obj);
		} else if (tipo === 'd') {
			const obj = <ColunaTipoData>{};
			obj.tipo = tipo;
			obj.valorMin = valorMin;
			obj.valorMax = valorMax;
			obj.filter = filter;
			this.filtros.push(obj);
		} else if (tipo === '$') {
			const obj = <ColunaTipoDinheiro>{};
			obj.tipo = tipo;
			obj.valor = '';
			this.filtros.push(obj);
		} else if (tipo === 'c') {
			const obj = <ColunaTipoCombo>{};
			obj.tipo = tipo;
			obj.valor = null;
			this.filtros.push(obj);
		}
	}
}

export interface ColunaTipoData {
	tipo: String;
	valorMin: null;
	valorMax: null;
	filter?: boolean;
}
export interface ColunaTipoString {
	tipo: String;
	valor: String;
}
export interface ColunaTipoDinheiro {
	tipo: String;
	valor: String;
}
export interface modelTabela {
	ID: number;
	COLUNA1: string;
	COLUNA2: string;
	COLUNA3: string;
	COLUNA4: string;
	COLUNA5: string;
	COLUNA6: string;
	COLUNA7: string;
}


export class Tabela {
	public nome: string;
	public colspan: Number;
	public filtros: Array<{tipo: String,valorMin?: any,valorMax?: any,filter?: boolean}>;
	constructor(nome: string, size: Number) {
		this.nome = nome;
		this.colspan = size;
		this.filtros = [];
	}
	addCol(
		tipo: String,
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
		}
	}
}

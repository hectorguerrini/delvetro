export class Paginacao {
	length: number;
	index: number;
	pageSize: number;
	pageSizeOptions: Array<number>;
	lista: Array<any>;
	constructor() {
		this.index = 0;
		this.pageSize = 10;
		this.pageSizeOptions = [5, 10, 20, 40];
		this.lista = [];
	}
}

export interface colunaTipoData {
    tipo: String,
    valorMin: null,
    valorMax: null,
    filter?: boolean
    
}
export interface colunaTipoString {
    tipo: String,
    valor: String    
}
export interface colunaTipoDinheiro {
    tipo: String,
    valor: String    
}


export class Tabela{
    nome: string;
    colspan: Number;    
    filtros: Array<any>                   
    constructor(nome: string,size: Number){
        this.nome = nome;
        this.colspan = size;
        this.filtros = [];
    }
    addCol(tipo: String, valorMin?: any, valorMax?: any, filter?: boolean): void{
        
        if (tipo == 's'){
            let obj = <colunaTipoString>{};
            obj.tipo = tipo;
            obj.valor = '';
            this.filtros.push(obj)
        } else if (tipo == 'd'){
            let obj = <colunaTipoData>{};
            obj.tipo = tipo;
            obj.valorMin = valorMin;
            obj.valorMax = valorMax;
            obj.filter = filter;
            this.filtros.push(obj)
        } else if(tipo == '$'){
            let obj = <colunaTipoDinheiro>{};
            obj.tipo = tipo;
            obj.valor = '';
            this.filtros.push(obj);
        }                      
    }
}

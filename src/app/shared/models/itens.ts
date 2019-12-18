export interface CheckBox {
    check: Boolean;
}
export interface Itens extends CheckBox{
    ID_ITEM_VENDIDO: number;
    ID_PRODUTO: number;
    NM_PRODUTO: string;
    ID_VENDA: number;
    QTDE: number;
    LARGURA: number;
    ALTURA: number;
    STATUS: string;
    DT_VENDA: string;
    ID_CLIENTE: number;
    NM_CLIENTE: string;
    STATUS_FINANCEIRO: string;
    ARQUIVO_DESENHO: string;
}

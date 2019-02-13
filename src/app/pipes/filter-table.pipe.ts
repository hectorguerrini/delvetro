import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {

  transform(items: any[], filtro: string): any {
    let saida = [];
    if(filtro === 'NPago') {      
      saida = items.filter(el => { return el.status_pagamento === 'Ñ Pago' } );
    } else if (filtro === 'Pago') {
      saida = items.filter(el => { return el.status_pagamento === 'Pago' || el.status_pagamento === 'Parcial' } );
    } else {
      saida = items;
    }
    return saida;
  }

}

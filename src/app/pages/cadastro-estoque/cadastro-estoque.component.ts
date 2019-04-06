import { Component, OnInit } from '@angular/core';
import { Validators , FormGroup, FormBuilder } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { Combo } from 'src/app/models/combo';
import { CadastroEstoqueService } from './cadastro-estoque.service';
import { Estoque } from 'src/app/models/estoque';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MessageComponent } from 'src/app/dialogs/message/message.component';
@Component({
  selector: 'app-cadastro-estoque',
  templateUrl: './cadastro-estoque.component.html',
  styleUrls: ['./cadastro-estoque.component.scss']
})
export class CadastroEstoqueComponent implements OnInit {
  submitted: boolean = false;
  estoqueForm: FormGroup = this.fb.group({
    ID_ESTOQUE: [''],
    ID_TIPO: ['', Validators.required],
    DESCRICAO: ['', Validators.required],
    QTDE: [0],
    UNIDADE: ['Unitario', Validators.required],
    ESPESSURA: [],
    LOCALIZACAO: [''],    
    ESTOQUE_MIN: [0, Validators.required],
    ESTOQUE_MAX: [0, Validators.required],    
    CUSTO_ULTIMO_RECEBIMENTO: ['0,00']
    
  });
  comboTiposEstoque: Array<Combo> = [];
  constructor(private fb: FormBuilder, private estoqueService: CadastroEstoqueService,private dialog: MatDialog) { 
    this.getCombo('tipo_estoque');
  }

  ngOnInit() {
    this.onChanges();
  }
  onChanges(): void {
    this.estoqueForm.get('ID_TIPO').valueChanges
      .subscribe(tipo => {
        if (tipo === 1) {          
          this.estoqueForm.get('ESPESSURA').setValidators([Validators.required]);
        } else {        
          this.estoqueForm.get('ESPESSURA').setValidators(null);
        }        
        this.estoqueForm.get('ESPESSURA').updateValueAndValidity();
      })
    this.estoqueForm.get('CUSTO_ULTIMO_RECEBIMENTO').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(custo => {
        let valor = custo.replace(/\D/g, '')
          .replace(/((\d{1,2})$)/g, ',$2')
          .replace(/(^(0)+)/g, '');
        valor = `${valor.replace(/^(\D)/g, '0$1')}`;
        this.estoqueForm.get('CUSTO_ULTIMO_RECEBIMENTO').setValue(valor);
        this.estoqueForm.get('CUSTO_ULTIMO_RECEBIMENTO').updateValueAndValidity()
      })
  }
  getCombo(tipo: string): void{
    this.estoqueService.getCombo(tipo)
    .subscribe((data: {query:string, json:Array<Combo>}) => {
      if(tipo === 'tipo_estoque'){
        this.comboTiposEstoque = data.json;
      }
      
    });    
  }
  submitEstoque(): void{
    this.submitted = true;
    if(this.estoqueForm.invalid){
      return
    }
    const estoque = new Estoque();  
    let json = Object.assign(estoque, this.estoqueForm.value);
    json.CUSTO_ULTIMO_RECEBIMENTO = json.CUSTO_ULTIMO_RECEBIMENTO.replace(',','.');
    json.DESCRICAO = json.DESCRICAO.toUpperCase();
    this.estoqueService.cadastroEstoque(json)
    .subscribe((data: {query:string, json:Array<Estoque>}) => {
      if(data.json.length > 0){
        this.popup('success','Cadastro Efetuado com sucesso')
      } else {
        this.popup('erro','Error no cadastro')
      }

    })
  }
  popup(status, message) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '260px';
    dialogConfig.data = { status: status, message: message };
    const dialogRef = this.dialog.open(MessageComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.submitted = false;
      this.estoqueForm.reset();
    });

  }
}

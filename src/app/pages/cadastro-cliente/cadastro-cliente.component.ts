import { Component, OnInit } from '@angular/core';
import { Validators , FormGroup, FormBuilder } from '@angular/forms';
import { CadastroClienteService } from './cadastro-cliente.service';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Cliente } from 'src/app/models/cliente';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MessageComponent } from 'src/app/dialogs/message/message.component';

interface Combo {
  VALOR:number;
  LABEL:string;
}
@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss']
})
export class CadastroClienteComponent implements OnInit {
  submitted: boolean = false;
  clienteForm: FormGroup = this.fb.group({
    ID_CLIENTE: [''],
    NM_CLIENTE: ['', Validators.required],    
    RAZAO_SOCIAL: ['', Validators.required],
    ENDERECO: ['', Validators.required],
    NUMERO: ['', Validators.required],    
    BAIRRO: ['', Validators.required],
    CIDADE: ['', Validators.required],
    CEP: ['', Validators.required],
    ESTADO: ['', Validators.required],
    EMAIL: ['', Validators.required],
    TELEFONE_1: ['', Validators.required],
    TELEFONE_2: [''],
    TELEFONE_3: [''],
    NM_CONTATO: ['', Validators.required],
    LOJISTA: ['', Validators.required],
    RG: ['', Validators.required],  
    CPF: ['', Validators.required],  
    COMPLEMENTO: [''],
  });
  comboClientes: Array<Combo> = [];
  constructor(private fb: FormBuilder,private cadastroService: CadastroClienteService, private dialog: MatDialog) { 
    this.getCombo('clientes');
  }

  ngOnInit() {
    this.onChanges();
  }
  onChanges(): void{
    this.clienteForm.get('CEP').valueChanges
    .subscribe(cep => {
      if(cep.length == 8){
        this.cadastroService.getCEP(cep)
        .subscribe((data: any) => {
          this.clienteForm.get('CEP').setValue(data.cep);
          this.clienteForm.get('ENDERECO').setValue(data.logradouro);
          this.clienteForm.get('CIDADE').setValue(data.localidade);
          this.clienteForm.get('ESTADO').setValue(data.uf);
          this.clienteForm.get('BAIRRO').setValue(data.bairro);
        })
      }
    })
  }
  selectCliente(item: {VALOR: number}): void{
    this.cadastroService.getCliente(item.VALOR)
    .subscribe((data: {query:string, json:Array<Cliente>}) => {
      if(data.json.length > 0){
        this.clienteForm.patchValue(data.json[0]); 
        this.clienteForm.value['NM_CLIENTE'] = data.json[0].NM_CLIENTE; 
        this.clienteForm.value['ID_CLIENTE'] = data.json[0].ID_CLIENTE;
        console.log(this.clienteForm)
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
      this.clienteForm.reset();
    });

  }
  submitCliente(): void {
    this.submitted = true;
    if(this.clienteForm.invalid){
      return
    }
    const cliente = new Cliente();  
    let json = Object.assign(cliente, this.clienteForm.value);
    json.LOJISTA = json.LOJISTA*1;
    this.cadastroService.cadastroCliente(json)
    .subscribe((data:  {query:string, json:Array<Cliente>}) => {
      if(data.json.length > 0){
        this.popup('success','Cadastro Efetuado com sucesso')
      } else {
        this.popup('erro','Error no cadastro')
      }

    })

  }
  
  getCombo(tipo: string): void{
    this.cadastroService.getCombo(tipo)
    .subscribe((data: {query:string, json:Array<Combo>}) => {
      if(tipo === 'clientes'){
        this.comboClientes = data.json;
      }
      
    });    
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.comboClientes.filter(v => v.LABEL.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 5)
      )
    )

  formatter = (x: { LABEL: string }) => x.LABEL;

}

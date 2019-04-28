import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Combo } from 'src/app/models/combo';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { VendasService } from './vendas.service';
import { vendasLista } from 'src/app/models/vendasLista';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {
  submitted2 = false;

  vendaForm: FormGroup = this.fb.group({
    ID_CLIENTE: ['', Validators.required],
    NM_CLIENTE: ['', Validators.required],
    CUSTO: [''],
    ITENS: this.fb.array([])
  });
  itensForm: FormGroup = this.fb.group({
    ID: [null, Validators.required],		
    TIPO: [''],
    NM_PRODUTO: ['', Validators.required],
    QTDE: [null, Validators.required],
    LARGURA: [''],
    ALTURA: [''],
		CUSTO: ['']
	});
  comboClientes: Array<Combo> = [];
  comboProdutos: Array<Combo> = [];
  vendasLista: Array<vendasLista> = [];
  novaVenda: boolean = false;
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private vendasService: VendasService,
    private dialog: MatDialog
  ) {
    appService
      .getCombo('clientes')
      .subscribe((data: { query: string; json: Array<Combo> }) => {
        this.comboClientes = data.json;
      });
    appService
      .getCombo('produtos')
      .subscribe((data: { query: string; json: Array<Combo> }) => {
        this.comboProdutos = data.json;
      });
  }

  ngOnInit() {
  
  }
  rmComposicao(i: number): void {
		const composicao = this.vendaForm.get('COMPOSICAO') as FormArray;
		composicao.removeAt(i);
		let total = 0;
		composicao.value.map(el => {
			total += el.CUSTO;
		});
		this.vendaForm.get('CUSTO').setValue(total);
	}
	addComposicao(): void {
		this.submitted2 = true;
		if ( this.itensForm.invalid ) {
			return;
		}
		const composicao = this.vendaForm.get('COMPOSICAO') as FormArray;
		const obj = this.itensForm.value;
		composicao.push(this.fb.group({
			TIPO: [obj.TIPO],
			ID: [obj.ID],
			DESCRICAO: [obj.DESCRICAO, Validators.required],
			QTDE_UTILIZADA: [obj.QTDE_UTILIZADA, Validators.required],
			CUSTO: [obj.CUSTO]
		}));
		let total = 0;
		this.submitted2 = false;		
	}
  selectCliente(item: string): void {    
		const obj = this.comboClientes.find(el => el.LABEL === item);
    this.vendaForm.get('ID_CLIENTE').setValue(obj.VALOR);
    this.vendasService
      .getVendasCliente(obj.VALOR)      
			.subscribe((data: { query: string; json: Array<vendasLista> }) => {
				if (data.json.length > 0) {
					this.vendasLista = data.json;					
				} else {
          this.vendasLista = [];
        }
			});
		
	}
  novoCliente(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80vw';
    dialogConfig.panelClass = 'model-cadastro';
    //dialogConfig.data = { status: status, message: message };
    const dialogRef = this.dialog.open(CadastroClienteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  searchItens = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term =>
      term === ''
        ? []
        : this.comboProdutos
          .filter(
            v =>
              v.LABEL.toLowerCase().indexOf(
                term.toLowerCase()
              ) > -1
          )
          .slice(0, 10)
          .map(s => s.LABEL)
    )
  )
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.comboClientes
            .filter(
              v =>
                v.LABEL.toLowerCase().indexOf(
                  term.toLowerCase()
                ) > -1
            )
            .slice(0, 5)
            .map(s => s.LABEL)
      )
    )

  formatter = (LABEL: string) => LABEL;

}

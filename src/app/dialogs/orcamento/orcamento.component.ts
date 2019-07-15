import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venda } from 'src/app/models/venda';

@Component({
	selector: 'app-orcamento',
	templateUrl: './orcamento.component.html',
	styleUrls: ['./orcamento.component.scss']
})
export class OrcamentoComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<OrcamentoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Venda
	) { }

	ngOnInit() {
	}
	onOkClick(): void {
		this.dialogRef.close(true);
	}

}

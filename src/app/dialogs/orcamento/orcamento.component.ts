import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venda } from 'src/app/models/venda';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
@Component({
	selector: 'app-orcamento',
	templateUrl: './orcamento.component.html',
	styleUrls: ['./orcamento.component.scss']
})
export class OrcamentoComponent implements OnInit {
	time = moment().format('LLL');
	constructor(
		public dialogRef: MatDialogRef<OrcamentoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Venda
	) { }

	ngOnInit() {
	}
	onOkClick(): void {
		this.dialogRef.close(true);
	}

	downloadOrcamento(): void {
		const el = document.getElementById(`orcamento`);

		html2canvas(el, {
			width: 560,
			height: 400
		}).then(canvas => {
			const contentDataURL = canvas.toDataURL('image/png');

			const a = document.createElement('a');
			a.href = contentDataURL;
			a.download = `orçamento_${this.data.NM_CLIENTE}_${moment().format('MM/DD/YYYY')}.png`;
			a.click();
		});
	}
}

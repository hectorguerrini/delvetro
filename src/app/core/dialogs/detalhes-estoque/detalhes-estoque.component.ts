import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControleEstoque } from 'src/app/shared/models/estoque';
import { AttQtdeEstoque, LogEstoque } from 'src/app/shared/models/attQtdeEstoque';

@Component({
	selector: 'app-detalhes-estoque',
	templateUrl: './detalhes-estoque.component.html',
	styleUrls: ['./detalhes-estoque.component.scss']
})
export class DetalhesEstoqueComponent implements OnInit {
	formAtt: AttQtdeEstoque;
	logEstoque: Array<LogEstoque>;
	constructor(
		public dialogRef: MatDialogRef<DetalhesEstoqueComponent>,
		private appService: AppService,
		@Inject(MAT_DIALOG_DATA) public data: ControleEstoque
	) { }

	ngOnInit() {
		console.log(this.data);
		this.formAtt = {
			ID_ESTOQUE: this.data.ID_ESTOQUE,
			MOTIVO: null,
			VALOR: null
		};
		this.getTracking();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	updateQtdeEstoque(): void {
		if (!this.formAtt.MOTIVO || !this.formAtt.VALOR) {
			this.appService.popup('error', 'Insira Valores Validos');
			return;
		}
		this.appService.updateQtdeEstoque(this.formAtt)
			.subscribe((data: { query: string; json: Array<any>}) => {
				if (data.json.length > 0) {
					this.dialogRef.close(true);
					this.appService.popup('success', 'Estoque Atualizado.');
				}

			});
	}
	getTracking(): void {
		this.appService.getLogEstoque(this.data.ID_ESTOQUE)
			.subscribe((data: { query: string; json: Array<LogEstoque>}) => {
				if (data.json.length > 0) {
					this.logEstoque = data.json;
				}
			});

	}
}

import { Component, OnInit, Inject } from '@angular/core';
import { Itens } from 'src/app/shared/models/itens';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../services/app.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-detalhes-item',
	templateUrl: './detalhes-item.component.html',
	styleUrls: ['./detalhes-item.component.scss']
})
export class DetalhesItemComponent implements OnInit {
	tracking: Array<any> = [];
	constructor(
		public dialogRef: MatDialogRef<DetalhesItemComponent>,
		private appService: AppService,
		@Inject(MAT_DIALOG_DATA) public data: Itens
	) { }

	ngOnInit() {
		this.getTracking();
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
	getTracking(): void {

		this.appService.getTracking(this.data.ID_ITEM_VENDIDO)
			.subscribe((data: { query: string; json: Array<any> }) => {
				if (data.json.length) {
					this.tracking = data.json;
				} else {
					this.tracking = [];
				}
			});
	}
	openDesenho(): void {
		window.open(
			`${environment.pathItens}/${this.data.ID_CLIENTE}/${this.data.ARQUIVO_DESENHO}`,
			'_blank'
		);
	}
}

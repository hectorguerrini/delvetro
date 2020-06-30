import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Combo } from 'src/app/shared/models/combo';

@Component({
	selector: 'app-selection',
	templateUrl: './selection.component.html',
	styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
	servico: Combo;
	constructor(
		public dialogRef: MatDialogRef<SelectionComponent>,
		@Inject(MAT_DIALOG_DATA) public modal: { title: string, data: Array<Combo> }
	) { }

	ngOnInit() { }
	onNoClick(): void {
		this.dialogRef.close();
	}


}

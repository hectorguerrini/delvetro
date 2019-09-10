import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialogdata } from '../../shared/models/dialogdata';
@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<MessageComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Dialogdata
	) {}

	ngOnInit() {}
	onNoClick(): void {
		this.dialogRef.close();
	  }
	
}

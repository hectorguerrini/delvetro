import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../dialogs/message/message.component';
@Injectable({
	providedIn: 'root'
})
export class AppService {
	url = environment.url;	
	constructor(public http: HttpClient, private dialog: MatDialog) {}

	getCombo(tipo: String) {
		const url = `${this.url}/combo/${tipo}`;

		return this.http.get(url, {
			headers: new HttpHeaders().set('Content-Type', 'application/json')
		});
	}

	convertLabeltoNumber(label: string): number {
		return parseFloat(label.replace(',', '.'));
	}

	popup(status: string, message: string) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.hasBackdrop = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '260px';
		dialogConfig.data = { status: status, message: message };
		const dialogRef = this.dialog.open(MessageComponent, dialogConfig);

		dialogRef.afterClosed().subscribe(result => {			
		});
	}
}

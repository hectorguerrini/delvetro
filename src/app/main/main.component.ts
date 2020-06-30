import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	path: string;
	constructor(private router: Router) { }

	ngOnInit() {
		this.router.events
			.subscribe((data) => {
				this.path = this.router.url;
				console.log(this.router.url);
			});
	}

}

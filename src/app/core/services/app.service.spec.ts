import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';

describe('AppService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: AppService = TestBed.inject(AppService);
		expect(service).toBeTruthy();
	});
});

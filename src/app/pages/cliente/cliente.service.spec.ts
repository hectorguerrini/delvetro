import { TestBed } from '@angular/core/testing';

import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ClienteService = TestBed.inject(ClienteService);
		expect(service).toBeTruthy();
	});
});

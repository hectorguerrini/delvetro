import { TestBed } from '@angular/core/testing';

import { VendaService } from './venda.service';

describe('VendasService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: VendasService = TestBed.get(VendasService);
		expect(service).toBeTruthy();
	});
});

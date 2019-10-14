import { TestBed } from '@angular/core/testing';

import { FinanceiroService } from './financeiro.service';

describe('FinanceiroService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: FinanceiroService = TestBed.get(FinanceiroService);
		expect(service).toBeTruthy();
	});
});

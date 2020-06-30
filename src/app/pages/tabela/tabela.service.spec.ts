import { TestBed } from '@angular/core/testing';

import { TabelaService } from './tabela.service';

describe('TabelaService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TabelaService = TestBed.inject(TabelaService);
		expect(service).toBeTruthy();
	});
});

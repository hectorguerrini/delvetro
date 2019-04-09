import { TestBed } from '@angular/core/testing';

import { CadastroClienteService } from './cadastro-cliente.service';

describe('CadastroClienteService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: CadastroClienteService = TestBed.get(CadastroClienteService);
		expect(service).toBeTruthy();
	});
});

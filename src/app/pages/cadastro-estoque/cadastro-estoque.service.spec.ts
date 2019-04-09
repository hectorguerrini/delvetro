import { TestBed } from '@angular/core/testing';

import { CadastroEstoqueService } from './cadastro-estoque.service';

describe('CadastroEstoqueService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: CadastroEstoqueService = TestBed.get(CadastroEstoqueService);
		expect(service).toBeTruthy();
	});
});

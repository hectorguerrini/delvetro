import { TestBed } from '@angular/core/testing';

import { CadastroProdutosService } from './cadastro-produtos.service';

describe('CadastroProdutosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CadastroProdutosService = TestBed.get(CadastroProdutosService);
    expect(service).toBeTruthy();
  });
});

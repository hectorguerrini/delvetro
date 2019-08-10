import { TestBed } from '@angular/core/testing';

import { PagamentosService } from './pagamentos.service';

describe('PagamentosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagamentosService = TestBed.get(PagamentosService);
    expect(service).toBeTruthy();
  });
});

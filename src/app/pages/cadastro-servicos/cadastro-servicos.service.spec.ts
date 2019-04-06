import { TestBed } from '@angular/core/testing';

import { CadastroServicosService } from './cadastro-servicos.service';

describe('CadastroServicosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CadastroServicosService = TestBed.get(CadastroServicosService);
    expect(service).toBeTruthy();
  });
});

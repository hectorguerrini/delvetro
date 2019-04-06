import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroServicosComponent } from './cadastro-servicos.component';

describe('CadastroServicosComponent', () => {
  let component: CadastroServicosComponent;
  let fixture: ComponentFixture<CadastroServicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroServicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

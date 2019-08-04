import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroBeneficiadosComponent } from './cadastro-beneficiados.component';

describe('CadastroBeneficiadosComponent', () => {
  let component: CadastroBeneficiadosComponent;
  let fixture: ComponentFixture<CadastroBeneficiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroBeneficiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroBeneficiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

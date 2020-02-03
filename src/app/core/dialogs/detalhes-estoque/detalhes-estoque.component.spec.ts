import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEstoqueComponent } from './detalhes-estoque.component';

describe('DetalhesEstoqueComponent', () => {
  let component: DetalhesEstoqueComponent;
  let fixture: ComponentFixture<DetalhesEstoqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesEstoqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

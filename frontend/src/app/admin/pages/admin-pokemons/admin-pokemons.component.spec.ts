import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPokemonsComponent } from './admin-pokemons.component';

describe('AdminPokemonsComponent', () => {
  let component: AdminPokemonsComponent;
  let fixture: ComponentFixture<AdminPokemonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPokemonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPokemonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

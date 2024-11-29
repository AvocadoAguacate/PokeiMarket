import { PokemonList } from './../../pokemon.model';
import { MystoreService } from './../../mystore.service';
import { AuthService } from './../../../shared/services/auth.service';
import { StoreService } from './../../services/store.service';
import { Component } from '@angular/core';
import { StoreItemComponent } from "../../components/store-item/store-item.component";
import { StoreFilterComponent } from "../../components/store-filter/store-filter.component";

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [StoreItemComponent, StoreFilterComponent],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
  public pokemons:PokemonList[] = []
  constructor(private storeService: MystoreService) {
    this.storeService.fetchPokemons(null)
  }

  ngOnInit(): void {
    // Suscribirse al observable
    this.storeService.pokemons$.subscribe((pokemons) => {
      this.pokemons = pokemons; // Se actualiza automáticamente
    });
  }
}

import { PokemonList } from './../../pokemon.model';
import { MystoreService } from './../../mystore.service';
import { AuthService } from './../../../shared/services/auth.service';
import { StoreService } from './../../services/store.service';
import { Component } from '@angular/core';
import { StoreItemComponent } from "../../components/store-item/store-item.component";

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [StoreItemComponent],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
  public pokemons:PokemonList[] = []
  constructor(
    private storeService: MystoreService
  ){
    this.storeService.getPokemons(null)
    .then((response:PokemonList[]) => {
      // Imprimir la respuesta
      this.pokemons = response;
    })
    .catch((error) => {
      // Si hay un error
      console.error('Error fetching pokemons:', error);
    });;
  }
}

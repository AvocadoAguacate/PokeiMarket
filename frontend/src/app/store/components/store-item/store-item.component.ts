import { PokemonList } from './../../pokemon.model';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule
],
  templateUrl: './store-item.component.html',
  styleUrl: './store-item.component.scss'
})
export class StoreItemComponent {
  constructor(
    private router:Router
  ){}
  @Input()
  public pokemon!:PokemonList;

  goDetail() {
    this.router.navigate(['/store/item/', this.pokemon.id, this.pokemon.generation]);
  }
}

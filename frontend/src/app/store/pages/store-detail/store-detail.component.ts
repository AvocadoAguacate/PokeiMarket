import { PokemonDetail } from './../../pokemon.model';
import { MystoreService } from './../../mystore.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './store-detail.component.html',
  styleUrl: './store-detail.component.scss'
})
export class StoreDetailComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  id: string | null = null;
  generation: string | null = null;
  public pokemon:PokemonDetail[] = []
  currentIndex: number = 0;
  constructor(
    private route: ActivatedRoute,
    private storeService: MystoreService
  ) {
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id =params.get('id');
      this.generation = params.get('generation');
      this.storeService.fetchPokemon({id: this.id, generation: this.generation});
      this.storeService.pokemon$.subscribe((pokemon) => {
        // const uniqueGenderPokemon = pokemon.filter((pokemon, index, self) => {
        //   return self.findIndex(p => p.gender_name === pokemon.gender_name) === index;
        // });
        this.pokemon = pokemon; 
      });
    });
  }
  updateFilter2(key: string, value: any) {
    if (value === '') {
      this.currentIndex = 0;  // Si el valor está vacío, asignar null
    } else {
      this.currentIndex = value;  // Asignar el valor directamente para otros casos
    }
    console.log(this.currentIndex)
  }
}

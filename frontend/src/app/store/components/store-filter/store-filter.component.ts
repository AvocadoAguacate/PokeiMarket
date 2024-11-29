import { MystoreService } from './../../mystore.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './store-filter.component.html',
  styleUrl: './store-filter.component.scss'
})
export class StoreFilterComponent {
onReset() {
  this.filters = {
    minPrice: null,
    maxPrice: null,
    generation: null,
    types: null
  };
}
  constructor(
    private storeService:MystoreService
  ){}
  types: string[] = [
    'bug', 'poison', 'rock', 'water', 'grass', 'fire',
    'flying', 'normal', 'ice', 'electric', 'dragon',
    'psychic', 'dark', 'fairy', 'ground', 'steel',
    'fighting', 'ghost'
  ];
  filters: { [key: string]: any } = {
    minPrice: null,
    maxPrice: null,
    generation: null,
    types: null
  };
  updateFilter(key: string, event: Event) {
    const target = event.target as HTMLInputElement; // Aserción de tipo
    this.filters[key] = target.value || null; // Usar target.value
  }
  updateFilter2(key: string, value: any) {
    if (value === '') {
      this.filters[key] = null;  // Si el valor está vacío, asignar null
    } else if (key === 'generation') {
      this.filters[key] = parseInt(value, 10);  // Convertir a número si es 'generation'
    } else {
      this.filters[key] = value;  // Asignar el valor directamente para otros casos
    }
  }
  onSubmit() {

    let toSend: { [key: string]: any } = {};

    // Revisar cada filtro y solo agregar los valores no nulos
    if (this.filters['minPrice'] !== null) {
      toSend['minPrice'] = parseInt(this.filters['minPrice']);
    }
  
    if (this.filters['maxPrice'] !== null) {
      toSend['maxPrice'] = parseInt(this.filters['maxPrice']);
    }
  
    if (this.filters['generation'] !== null) {
      toSend['generation'] = this.filters['generation'];
    }
  
    if (this.filters['types'] !== null) {
      toSend['types'] = this.filters['types'];
    }
    console.log(toSend);
    this.storeService.fetchPokemons(toSend);
  }

}

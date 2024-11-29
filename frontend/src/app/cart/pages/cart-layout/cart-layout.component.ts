import { CartService } from './../../services/cart.service';
import { CartItem } from './../../services/cart.model';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ItemComponent } from "../../components/item/item.component";

@Component({
  selector: 'app-cart-layout',
  standalone: true,
  imports: [ItemComponent,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './cart-layout.component.html',
  styleUrl: './cart-layout.component.scss'
})
export class CartLayoutComponent {
  public items:CartItem[] = [];

  constructor(
    private cartService:CartService,
    private router:Router
  ){
    this.cartService.loadCartItems()
    this.items = this.cartService.items
  }

  getTotal(){
    return this.cartService.calculateTotal()
  }

  onReturn() {
    this.router.navigate(['/store'])
  }
}

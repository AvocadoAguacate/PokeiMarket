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

@Component({
  selector: 'app-item',
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
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  constructor(
    private cartService:CartService
  ){}
  @Input()
  public item!:CartItem;
  @Input()
  public indexItem!:number;
  onDelete() {
    this.cartService.removeItem(this.indexItem);
  }
  onIncrease() {
    this.cartService.increaseQuantity(this.indexItem);
  }
  onDecrease() {
    this.cartService.decreaseQuantity(this.indexItem);
  }

}

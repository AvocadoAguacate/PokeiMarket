import { CartItem } from './cart.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public items: CartItem[] = [];
  constructor() {
    this.loadCartItems();
  }

  addItem(item: CartItem): void {
    this.items.push(item);
    this.saveCartItems(); 
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.saveCartItems(); 
  }
  increaseQuantity(index: number): void {
    if (this.items[index]) {
      this.items[index].quantity += 1; 
      this.saveCartItems();
    }
  }

  decreaseQuantity(index: number): void {
    if (this.items[index]) {
      this.items[index].quantity -= 1; 
      if(this.items[index].quantity === 0){
        this.removeItem(index);
      }
      this.saveCartItems();
    }
  }

  private saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  public loadCartItems(): void {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      this.items = JSON.parse(cartItems);
    }
  }

  calculateTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.quantity * item.cost); 
    }, 0); 
  }
}

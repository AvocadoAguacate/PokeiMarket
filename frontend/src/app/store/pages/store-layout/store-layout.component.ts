import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { StoreNavBarComponent } from "../../components/store-nav-bar/store-nav-bar.component";

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [StoreNavBarComponent, RouterOutlet],
  templateUrl: './store-layout.component.html',
  styleUrl: './store-layout.component.scss'
})
export class StoreLayoutComponent {

}

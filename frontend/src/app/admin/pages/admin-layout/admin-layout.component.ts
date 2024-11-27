import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { AdminNavBarComponent } from "../../components/admin-nav-bar/admin-nav-bar.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminNavBarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}

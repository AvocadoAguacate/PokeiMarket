import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { NavBarComponent } from "../../../shared/components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {

}

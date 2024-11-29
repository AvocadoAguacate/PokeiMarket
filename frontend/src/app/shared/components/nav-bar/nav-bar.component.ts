import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(
    private authService:AuthService,
    private router:Router
  ){}

logout() {
  this.authService.signOutUser()
  .then((res) => {
    this.router.navigate(['/auth']);
  }).catch((err) => { //no logra conectarse al backend
    console.log(err);
  })
}

}

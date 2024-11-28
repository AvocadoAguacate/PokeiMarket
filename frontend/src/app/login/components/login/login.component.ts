import { AuthService } from './../../../shared/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public LoginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {nonNullable: true}) 
  }); 
  constructor(
    private authService:AuthService,
    private router:Router
  ){

  }

  onRegister() {
    this.router.navigate(['/auth/register'])
  }
  onSubmit() {
    if(this.LoginForm.invalid) return;
    this.authService.signIn(this.LoginForm.value.email!, this.LoginForm.value.password!)
    .then(({data, error}) => {
      if(error){ //cuando logra conectarse al backend
        console.log(error);
      } else {
        console.log(data);
        if(data.user?.user_metadata?.['role'] === 'admin'){
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/store']);
        }
      }
    }).catch((err) => { //no logra conectarse al backend
      console.log(err);
    })
  }

}

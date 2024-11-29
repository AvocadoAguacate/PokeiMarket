import { Router } from '@angular/router';
import { AuthService } from './../../../shared/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public RegisterForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6), // Valida al menos 6 caracteres
      ],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
      ],
    }),
  }); 
  constructor(
    private authService:AuthService,
    private router:Router
  ){

  }
  onSubmit(){
    if(this.RegisterForm.invalid) return;
    this.authService.register(
      this.RegisterForm.value.email!,
      this.RegisterForm.value.password!,
      this.RegisterForm.value.name!
    ).then(({data, error}) => {
      if(error){ //cuando logra conectarse al backend
        console.log(error);
        this.RegisterForm.reset();
      } else {
        console.log(data);
        this.router.navigate(['/store']);
      }
    }).catch((err) => { //no logra conectarse al backend
      console.log(err);
      this.RegisterForm.reset();
    })
  }
}

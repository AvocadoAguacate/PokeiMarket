import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { UserLayoutComponent } from './user/pages/user-layout/user-layout.component';
import { CartLayoutComponent } from './cart/pages/cart-layout/cart-layout.component';
import { BuyLayoutComponent } from './buy/pages/buy-layout/buy-layout.component';
import { StaffLayoutComponent } from './staff/pages/staff-layout/staff-layout.component';
import { AdminLayoutComponent } from './admin/pages/admin-layout/admin-layout.component';
import { StoreDetailComponent } from './store/pages/store-detail/store-detail.component';
import { StoreListComponent } from './store/pages/store-list/store-list.component';
import { StoreLayoutComponent } from './store/pages/store-layout/store-layout.component';
import { ForgotPasswordComponent } from './login/components/forgot-password/forgot-password.component';
import { RegisterComponent } from './login/components/register/register.component';
import { LoginComponent } from './login/components/login/login.component';
import { LoginLayoutComponent } from './login/pages/login-layout/login-layout.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginLayoutComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: '**', redirectTo: 'login'}
    ]
  },
  {
    path: 'store',
    component: StoreLayoutComponent,
    children: [
      {path: 'list', component: StoreListComponent},
      {path: 'item', component: StoreDetailComponent},
      {path: '**', redirectTo: 'list'}
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      //TODO crear administrar staff, administrar clientes, administrar pokemons, administrar items
      //TODO eliminar lo siguiente
      {path: 'home', component: StoreListComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: 'staff',
    component: StaffLayoutComponent,
    children: [
      //TODO lista de pendientes, administrar stock
      //TODO eliminar lo siguiente
      {path: 'home', component: StoreListComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: 'buy',
    component: BuyLayoutComponent,
    children: [
      //TODO escoger forma de envio y dirección, escoger forma de pago, confirmar compra
      //TODO eliminar lo siguiente
      {path: 'home', component: StoreListComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: 'cart',
    component: CartLayoutComponent
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      //TODO home de usuario (lista de direcciones, pagos y ordenes), editar dirección, editar forma de pago
      //TODO eliminar lo siguiente
      {path: 'home', component: StoreListComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  }
];

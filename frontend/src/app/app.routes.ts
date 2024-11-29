import { ListMethodComponent } from './user/pages/list-method/list-method.component';
import { ListOrderComponent } from './user/pages/list-order/list-order.component';
import { ListDirectionComponent } from './user/pages/list-direction/list-direction.component';
import { UserHomeComponent } from './user/pages/user-home/user-home.component';
import { ResumeComponent } from './buy/pages/resume/resume.component';
import { MethodComponent } from './buy/pages/method/method.component';
import { DirectionComponent } from './buy/pages/direction/direction.component';
import { StockComponent } from './staff/pages/stock/stock.component';
import { StaffHomeComponent } from './staff/pages/staff-home/staff-home.component';
import { AdminItemsComponent } from './admin/pages/admin-items/admin-items.component';
import { AdminPokemonsComponent } from './admin/pages/admin-pokemons/admin-pokemons.component';
import { AdminStaffComponent } from './admin/pages/admin-staff/admin-staff.component';
import { AdminClientsComponent } from './admin/pages/admin-clients/admin-clients.component';
import { AdminHomeComponent } from './admin/pages/admin-home/admin-home.component';
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
      {path: 'item/:id/:generation', component: StoreDetailComponent},
      {path: '**', redirectTo: 'list'}
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: 'home', component: AdminHomeComponent},
      {path: 'clients', component: AdminClientsComponent},
      {path: 'staff', component: AdminStaffComponent},
      {path: 'pokemons', component: AdminPokemonsComponent},
      {path: 'items', component: AdminItemsComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: 'staff',
    component: StaffLayoutComponent,
    children: [
      {path: 'home', component: StaffHomeComponent},
      {path: 'stock', component: StockComponent},
      {path: '**', redirectTo: 'home'}
    ]
  },
  {
    path: 'buy',
    component: BuyLayoutComponent,
    children: [
      {path: 'direction', component: DirectionComponent},
      {path: 'method', component: MethodComponent},
      {path: 'resume', component: ResumeComponent},
      {path: '**', redirectTo: 'direction'}
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
      {path: 'home', component: UserHomeComponent},
      {path: 'direction', component: ListDirectionComponent},
      {path: 'order', component: ListOrderComponent},
      {path: 'method', component: ListMethodComponent},
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

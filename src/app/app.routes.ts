import { Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home';   // ✅ add home component
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },   // ✅ default goes to Home
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent }
];

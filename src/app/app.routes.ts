import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { UserListComponent } from './features/users/user-list.component';
import { LabListComponent } from './features/labs/lab-list.component';
import { authGuard } from './core/auth/auth.guard';

export const APP_ROUTES: Routes = [
  { path: 'auth/login', component: LoginComponent },

  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'labs', component: LabListComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

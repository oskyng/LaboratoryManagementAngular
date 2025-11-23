import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/auth/profile.component';
import { RecoverPasswordComponent } from './features/auth/recover-password.component';
import {Routes} from "@angular/router";
import {LoginComponent} from "./features/auth/login.component";
import {authGuard} from "./core/auth/auth.guard";
import {UserListComponent} from "./features/users/user-list.component";
import {LabListComponent} from "./features/labs/lab-list.component";

export const APP_ROUTES: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/recover', component: RecoverPasswordComponent },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'labs', component: LabListComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand">Clinical Labs</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a routerLink="/auth/login" routerLinkActive="active" class="nav-link">Login</a>
            </li>
            <li class="nav-item">
              <a routerLink="/users" routerLinkActive="active" class="nav-link">Usuarios</a>
            </li>
            <li class="nav-item">
              <a routerLink="/labs" routerLinkActive="active" class="nav-link">Laboratorios</a>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto" *ngIf="loggedIn">
            <li class="nav-item">
              <a class="nav-link" (click)="logout()" style="cursor: pointer;">
                Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="row">
        <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  get loggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

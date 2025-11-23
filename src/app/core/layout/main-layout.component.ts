import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">Clinical Labs</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="!loggedIn">
              <a routerLink="/auth/login" routerLinkActive="active" class="nav-link">Login</a>
            </li>
            <li class="nav-item"
                *ngIf="loggedIn && auth.hasRole('ADMIN')">
              <a routerLink="/users" routerLinkActive="active" class="nav-link">Usuarios</a>
            </li>
            <li class="nav-item" *ngIf="loggedIn">
              <a routerLink="/labs" routerLinkActive="active" class="nav-link">Laboratorios</a>
            </li>
            <li class="nav-item" *ngIf="loggedIn">
              <a routerLink="/profile" routerLinkActive="active" class="nav-link">Mi Perfil</a>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto" *ngIf="loggedIn">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                👤 {{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" routerLink="/profile">
                    Mi Perfil
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" style="cursor:pointer;" (click)="logout()">
                    Cerrar sesión
                  </a>
                </li>
              </ul>
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

  constructor(public auth: AuthService, private router: Router) {}

  get loggedIn() {
    return this.auth.isLoggedIn();
  }

  get userName() {
    return localStorage.getItem('fullName') || localStorage.getItem('username');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from './auth.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, RouterLink],
  template: `
    <h2 class="mb-4 text-center">Inicio de sesión</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" formControlName="email">
        <app-form-error [control]="form.get('email')"></app-form-error>
      </div>

      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input type="password" class="form-control" formControlName="password">
        <app-form-error [control]="form.get('password')"></app-form-error>
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </div>

      <div class="text-center mt-3">
        <a routerLink="/auth/register">Crear cuenta</a> |
        <a routerLink="/auth/recover">¿Olvidaste tu contraseña?</a>
      </div>

      <div *ngIf="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </form>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/users']); // al home de usuarios
      },
      error: () => {
        this.loading = false;
        this.error = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}

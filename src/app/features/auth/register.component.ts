import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  template: `
  <h2 class="mb-4 text-center">Registro de Usuario</h2>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">

    <div class="mb-3">
      <label class="form-label">Nombre Completo</label>
      <input type="text" class="form-control" formControlName="fullName">
      <app-form-error [control]="form.get('fullName')"></app-form-error>
    </div>

    <div class="mb-3">
      <label class="form-label">Correo</label>
      <input type="email" class="form-control" formControlName="email">
      <app-form-error [control]="form.get('email')"></app-form-error>
    </div>

    <div class="mb-3">
      <label class="form-label">Usuario</label>
      <input type="text" class="form-control" formControlName="username">
      <app-form-error [control]="form.get('username')"></app-form-error>
    </div>

    <div class="mb-3">
      <label class="form-label">Contraseña</label>
      <input type="password" class="form-control" formControlName="password">
      <app-form-error [control]="form.get('password')"></app-form-error>
    </div>

    <button class="btn btn-primary w-100" [disabled]="form.invalid">Crear Cuenta</button>

    <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
    <div *ngIf="success" class="alert alert-success mt-3">{{ success }}</div>

  </form>
  `
})
export class RegisterComponent {
  form: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Usuario registrado correctamente.';
        setTimeout(() => this.router.navigate(['/auth/login']), 1200);
      },
      error: () => this.error = 'El usuario o correo ya existe.'
    });
  }
}

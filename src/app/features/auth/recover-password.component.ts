import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'app-recover-password',
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  template: `
  <h2 class="mb-4 text-center">Recuperar Contraseña</h2>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">

    <div class="mb-3">
      <label class="form-label">Correo registrado</label>
      <input class="form-control" type="email" formControlName="email">
      <app-form-error [control]="form.get('email')"></app-form-error>
    </div>

    <button class="btn btn-primary w-100" [disabled]="form.invalid">Enviar</button>

    <div *ngIf="message" class="alert alert-success mt-3">{{ message }}</div>
    <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>

  </form>
  `
})
export class RecoverPasswordComponent {
  form: FormGroup;
  message: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.auth.recover(this.form.value.email).subscribe({
      next: (res) => this.message = res.message,
      error: () => this.error = 'El correo no existe en nuestro sistema.'
    });
  }
}

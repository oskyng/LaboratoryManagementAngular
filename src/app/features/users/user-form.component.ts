import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from './user.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          {{ form.value.id ? 'Editar usuario' : 'Nuevo usuario' }}
        </h5>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" formControlName="username">
              <app-form-error [control]="form.get('username')"></app-form-error>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Nombre completo</label>
              <input type="text" class="form-control" formControlName="fullName">
              <app-form-error [control]="form.get('fullName')"></app-form-error>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Correo</label>
              <input type="email" class="form-control" formControlName="email">
              <app-form-error [control]="form.get('email')"></app-form-error>
            </div>

            <div class="col-12 col-md-3 mb-3">
              <label class="form-label">Rol</label>
              <select class="form-select" formControlName="role">
                <option value="ADMIN">ADMIN</option>
                <option value="LAB_TECH">LAB_TECH</option>
                <option value="DOCTOR">DOCTOR</option>
              </select>
            </div>

            <div class="col-12 col-md-3 mb-3 d-flex align-items-center">
              <div class="form-check mt-3">
                <input class="form-check-input" type="checkbox" formControlName="active" id="chkActive">
                <label class="form-check-label" for="chkActive">Activo</label>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" (click)="cancelled.emit()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>

          <div *ngIf="error" class="alert alert-danger mt-3">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormComponent implements OnChanges {
  @Input() user!: User;
  @Output() saved = new EventEmitter<User>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['LAB_TECH', Validators.required],
      active: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue(this.user);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const value: User = this.form.value;

    const request$ = value.id
      ? this.userService.update(value.id, value)
      : this.userService.create(value);

    request$.subscribe({
      next: user => {
        this.loading = false;
        this.saved.emit(user);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al guardar el usuario.';
      }
    });
  }
}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lab } from '../../models/lab.model';
import { LabService } from './lab.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'lab-form',
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  template: `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          {{ form.value.id ? 'Editar laboratorio' : 'Nuevo laboratorio' }}
        </h5>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" formControlName="name">
              <app-form-error [control]="form.get('name')"></app-form-error>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Ubicación</label>
              <input type="text" class="form-control" formControlName="location">
              <app-form-error [control]="form.get('location')"></app-form-error>
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">Capacidad</label>
              <input type="number" class="form-control" formControlName="capacity" min="1">
              <app-form-error [control]="form.get('capacity')"></app-form-error>
            </div>

            <div class="col-12 col-md-6 mb-3 d-flex align-items-center">
              <div class="form-check mt-3">
                <input class="form-check-input" type="checkbox" formControlName="active" id="chkActiveLab">
                <label class="form-check-label" for="chkActiveLab">Activo</label>
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
export class LabFormComponent implements OnChanges {
  @Input() lab!: Lab;
  @Output() saved = new EventEmitter<Lab>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private labService: LabService) {
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      capacity: [0, [Validators.required]],
      active: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lab'] && this.lab) {
      this.form.patchValue(this.lab);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const value: Lab = this.form.value;

    const req$ = value.id
      ? this.labService.update(value.id, value)
      : this.labService.create(value);

    req$.subscribe({
      next: lab => {
        this.loading = false;
        this.saved.emit(lab);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al guardar el laboratorio.';
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Laboratory } from '../../models/laboratory.model';
import { LabService } from './lab.service';
import { LabFormComponent } from './lab-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error.component';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-lab-list',
  imports: [CommonModule, LabFormComponent, ReactiveFormsModule, FormErrorComponent],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Laboratorios</h2>
      <button class="btn btn-success" (click)="newLab()" *ngIf="isAdmin()">Nuevo laboratorio</button>
    </div>

    <!-- LISTA -->
    <div class="table-responsive mb-3">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let lab of labs">
            <td>{{ lab.name }}</td>
            <td>{{ lab.address || '-' }}</td>
            <td>{{ lab.phone || '-' }}</td>
            <td><span class="badge" [ngClass]="lab.status === 'ACTIVO' ? 'bg-success' : 'bg-secondary'">{{ lab.status || '-' }}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-primary me-2" (click)="editLab(lab)" *ngIf="isAdmin()">Editar</button>
              <button class="btn btn-sm btn-danger me-2" (click)="deleteLab(lab)" *ngIf="isAdmin()">Eliminar</button>
              <button class="btn btn-sm btn-outline-info" (click)="openAssign(lab)" *ngIf="canAssign()">Asignar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FORM LAB -->
    <lab-form
      *ngIf="selectedLab"
      [lab]="selectedLab"
      (saved)="onSaved($event)"
      (cancelled)="onCancelled()">
    </lab-form>

    <!-- FORM ASIGNACIÓN SIMPLE -->
    <div *ngIf="assignFormVisible" class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Asignar laboratorio: {{ currentLab?.name }}</h5>

        <form [formGroup]="assignmentForm" (ngSubmit)="assign()" novalidate>
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <label class="form-label">ID Usuario</label>
              <input type="number" class="form-control" formControlName="userId">
              <app-form-error [control]="assignmentForm.get('userId')"></app-form-error>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" (click)="cancelAssign()">Cancelar</button>
            <button type="submit" class="btn btn-info" [disabled]="assignmentForm.invalid || loadingAssign">
              {{ loadingAssign ? 'Asignando...' : 'Asignar' }}
            </button>
          </div>

          <div *ngIf="assignMessage" class="alert alert-success mt-3">
            {{ assignMessage }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class LabListComponent implements OnInit {
  labs: Laboratory[] = [];                         // ← lista/colección Angular
  selectedLab: Laboratory | null = null;
  currentLab: Laboratory | null = null;

  assignmentForm: FormGroup;
  assignFormVisible = false;
  loadingAssign = false;
  assignMessage: string | null = null;

  constructor(
    private labService: LabService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.assignmentForm = this.fb.group({
      userId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadLabs();
  }

  loadLabs(): void {
    this.labService.findAll().subscribe(labs => this.labs = labs);
  }

  newLab(): void {
    this.selectedLab = { name: '', address: '', phone: '', status: 'ACTIVO' };
  }

  editLab(lab: Laboratory): void {
    this.selectedLab = { ...lab };
  }

  deleteLab(lab: Laboratory): void {
    if (!lab.id) return;
    if (!confirm(`¿Eliminar laboratorio ${lab.name}?`)) return;
    this.labService.delete(lab.id).subscribe(() => this.loadLabs());
  }

  onSaved(_: Laboratory): void {
    this.selectedLab = null;
    this.loadLabs();
  }

  onCancelled(): void {
    this.selectedLab = null;
  }

  openAssign(lab: Laboratory): void {
    this.currentLab = lab;
    this.assignFormVisible = true;
    this.assignMessage = null;
    this.assignmentForm.reset();
  }

  cancelAssign(): void {
    this.assignFormVisible = false;
    this.currentLab = null;
  }

  assign(): void {
    if (!this.currentLab || this.assignmentForm.invalid) return;

    this.loadingAssign = true;
    const formValue = this.assignmentForm.value as { userId: number };

    this.labService.assign({
      laboratoryId: this.currentLab.id!,
      userId: formValue.userId
    }).subscribe({
      next: () => {
        this.loadingAssign = false;
        this.assignMessage = 'Asignación realizada correctamente.';
      },
      error: () => {
        this.loadingAssign = false;
        this.assignMessage = 'Error al asignar laboratorio.';
      }
    });
  }

  // Permisos por rol
  isAdmin(): boolean {
    return this.auth.hasAnyRole('ADMIN');
  }

  canAssign(): boolean {
    return this.auth.hasAnyRole('ADMIN', 'DOCTOR');
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lab } from '../../models/lab.model';
import { LabService } from './lab.service';
import { LabFormComponent } from './lab-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error.component';

@Component({
  standalone: true,
  selector: 'app-lab-list',
  imports: [CommonModule, LabFormComponent, ReactiveFormsModule, FormErrorComponent],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Laboratorios</h2>
      <button class="btn btn-success" (click)="newLab()">Nuevo laboratorio</button>
    </div>

    <!-- LISTA -->
    <div class="table-responsive mb-3">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Capacidad</th>
            <th>Activo</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let lab of labs">
            <td>{{ lab.name }}</td>
            <td>{{ lab.location }}</td>
            <td>{{ lab.capacity }}</td>
            <td>
              <span class="badge bg-success" *ngIf="lab.active">Sí</span>
              <span class="badge bg-secondary" *ngIf="!lab.active">No</span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-primary me-2" (click)="editLab(lab)">Editar</button>
              <button class="btn btn-sm btn-danger me-2" (click)="deleteLab(lab)">Eliminar</button>
              <button class="btn btn-sm btn-outline-info" (click)="openAssign(lab)">Asignar</button>
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
            <div class="col-12 col-md-4 mb-3">
              <label class="form-label">ID Paciente</label>
              <input type="number" class="form-control" formControlName="patientId">
              <app-form-error [control]="assignmentForm.get('patientId')"></app-form-error>
            </div>
            <div class="col-12 col-md-4 mb-3">
              <label class="form-label">Tipo de examen</label>
              <input type="text" class="form-control" formControlName="examType">
              <app-form-error [control]="assignmentForm.get('examType')"></app-form-error>
            </div>
            <div class="col-12 col-md-4 mb-3">
              <label class="form-label">Fecha programada</label>
              <input type="date" class="form-control" formControlName="scheduledDate">
              <app-form-error [control]="assignmentForm.get('scheduledDate')"></app-form-error>
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
  labs: Lab[] = [];                         // ← lista/colección Angular
  selectedLab: Lab | null = null;
  currentLab: Lab | null = null;

  assignmentForm: FormGroup;
  assignFormVisible = false;
  loadingAssign = false;
  assignMessage: string | null = null;

  constructor(
    private labService: LabService,
    private fb: FormBuilder
  ) {
    this.assignmentForm = this.fb.group({
      patientId: [null, [Validators.required]],
      examType: ['', [Validators.required]],
      scheduledDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadLabs();
  }

  loadLabs(): void {
    this.labService.findAll().subscribe(labs => this.labs = labs);
  }

  newLab(): void {
    this.selectedLab = { name: '', location: '', capacity: 0, active: true };
  }

  editLab(lab: Lab): void {
    this.selectedLab = { ...lab };
  }

  deleteLab(lab: Lab): void {
    if (!lab.id) return;
    if (!confirm(`¿Eliminar laboratorio ${lab.name}?`)) return;
    this.labService.delete(lab.id).subscribe(() => this.loadLabs());
  }

  onSaved(_: Lab): void {
    this.selectedLab = null;
    this.loadLabs();
  }

  onCancelled(): void {
    this.selectedLab = null;
  }

  openAssign(lab: Lab): void {
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
    const formValue = this.assignmentForm.value;

    this.labService.assignLab({
      labId: this.currentLab.id!,
      patientId: formValue.patientId,
      examType: formValue.examType,
      scheduledDate: formValue.scheduledDate
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
}

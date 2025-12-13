import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResultService, AnalysisResultDTO } from './analysis-result.service';

@Component({
  standalone: true,
  selector: 'app-results-list',
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Resultados de análisis</h2>
    </div>

    <div *ngIf="loading" class="alert alert-info">Cargando...</div>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

    <div class="table-responsive" *ngIf="!loading && !error">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Laboratorio</th>
            <th>Examen</th>
            <th>Resultado</th>
            <th>Unidades</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of results">
            <td>{{ r.id }}</td>
            <td>{{ r.userId }}</td>
            <td>{{ r.laboratoryId }}</td>
            <td>{{ r.testName }}</td>
            <td>{{ r.resultValue || '-' }}</td>
            <td>{{ r.units || '-' }}</td>
            <td>{{ r.status || '-' }}</td>
            <td>{{ r.createdAt || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="results.length === 0" class="alert alert-secondary">No hay resultados</div>
    </div>
  `
})
export class ResultsListComponent implements OnInit {
  results: AnalysisResultDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private service: AnalysisResultService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = null;
    this.service.listAll().subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los resultados.';
        this.loading = false;
      }
    });
  }
}

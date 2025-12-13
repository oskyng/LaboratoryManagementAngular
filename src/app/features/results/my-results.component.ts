import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisResultService, AnalysisResultDTO } from './analysis-result.service';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-my-results',
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Mis resultados</h2>
    </div>

    <div *ngIf="loading" class="alert alert-info">Cargando...</div>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

    <div class="table-responsive" *ngIf="!loading && !error">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
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
            <td>{{ r.laboratoryId }}</td>
            <td>{{ r.testName }}</td>
            <td>{{ r.resultValue || '-' }}</td>
            <td>{{ r.units || '-' }}</td>
            <td>{{ r.status || '-' }}</td>
            <td>{{ r.createdAt || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="results.length === 0" class="alert alert-secondary">No tienes resultados</div>
    </div>
  `
})
export class MyResultsComponent implements OnInit {
  results: AnalysisResultDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private service: AnalysisResultService, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user?.id) {
      this.error = 'No se pudo determinar el usuario actual.';
      return;
    }
    this.load(user.id);
  }

  private load(userId: number) {
    this.loading = true;
    this.error = null;
    this.service.getByUser(userId).subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar tus resultados.';
        this.loading = false;
      }
    });
  }
}

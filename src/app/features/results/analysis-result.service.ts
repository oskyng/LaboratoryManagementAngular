import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface AnalysisResultDTO {
  id?: number;
  userId: number;
  laboratoryId: number;
  testName: string;
  resultValue?: string;
  units?: string;
  status?: string;
  createdAt?: string;
  attachmentUrl?: string;
  observations?: string;
}

export interface AnalysisResultCreateRequest {
  userId: number;
  laboratoryId: number;
  testName: string;
  resultValue?: string;
  units?: string;
  status?: string;
  attachmentUrl?: string;
  observations?: string;
}

@Injectable({ providedIn: 'root' })
export class AnalysisResultService {
  private apiUrl = `${environment.apiUrl}/analysis-results`;

  constructor(private http: HttpClient) {}

  listAll(): Observable<AnalysisResultDTO[]> {
    return this.http.get<AnalysisResultDTO[]>(this.apiUrl);
  }

  getByUser(userId: number): Observable<AnalysisResultDTO[]> {
    return this.http.get<AnalysisResultDTO[]>(`${this.apiUrl}/by-user/${userId}`);
  }

  getByLab(labId: number): Observable<AnalysisResultDTO[]> {
    return this.http.get<AnalysisResultDTO[]>(`${this.apiUrl}/by-lab/${labId}`);
  }

  listByDate(from: string, to: string): Observable<AnalysisResultDTO[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<AnalysisResultDTO[]>(`${this.apiUrl}/by-date`, { params });
  }

  create(payload: AnalysisResultCreateRequest): Observable<AnalysisResultDTO> {
    return this.http.post<AnalysisResultDTO>(this.apiUrl, payload);
  }

  update(id: number, payload: AnalysisResultCreateRequest): Observable<AnalysisResultDTO> {
    return this.http.put<AnalysisResultDTO>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Laboratory, AssignmentRequest } from '../../models/laboratory.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LabService {

  private apiUrl = `${environment.apiUrl}/laboratory`;
  private assignmentUrl = `${environment.apiUrl}/assignment`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Laboratory[]> {
    return this.http.get<Laboratory[]>(this.apiUrl);
  }

  create(lab: Laboratory): Observable<Laboratory> {
    return this.http.post<Laboratory>(this.apiUrl, lab);
  }

  update(id: number, lab: Laboratory): Observable<Laboratory> {
    return this.http.put<Laboratory>(`${this.apiUrl}/${id}`, lab);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assign(request: AssignmentRequest): Observable<any> {
    // POST /api/assignment
    return this.http.post<any>(this.assignmentUrl, request);
  }
}

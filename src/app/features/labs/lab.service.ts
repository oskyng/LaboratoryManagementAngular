import { Injectable } from '@angular/core';
import { Lab } from '../../models/lab.model';
import { LabAssignment } from '../../models/assignment.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LabService {

  private labs: Lab[] = [
    { id: 1, name: 'Laboratorio Central', location: 'Piso 1', capacity: 15, active: true },
    { id: 2, name: 'Laboratorio Hematología', location: 'Piso 2', capacity: 10, active: true }
  ];

  private assignments: LabAssignment[] = [];

  private idCounter = 3;
  private assignmentCounter = 1;

  findAll(): Observable<Lab[]> {
    return of(this.labs);
  }

  create(lab: Lab): Observable<Lab> {
    lab.id = this.idCounter++;
    this.labs.push(lab);
    return of(lab);
  }

  update(id: number, lab: Lab): Observable<Lab> {
    const index = this.labs.findIndex(l => l.id === id);
    if (index !== -1) this.labs[index] = lab;
    return of(lab);
  }

  delete(id: number): Observable<void> {
    this.labs = this.labs.filter(l => l.id !== id);
    return of(undefined);
  }

  assignLab(assignment: LabAssignment): Observable<LabAssignment> {
    assignment.id = this.assignmentCounter++;
    this.assignments.push(assignment);
    return of(assignment);
  }
}

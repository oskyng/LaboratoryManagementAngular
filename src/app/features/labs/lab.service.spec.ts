import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LabService } from './lab.service';
import { Laboratory, AssignmentRequest } from '../../models/laboratory.model';
import { environment } from '../../../environments/environment';

describe('LabService', () => {
  let service: LabService;
  let httpTestingController: HttpTestingController;

  const labsApiUrl = `${environment.apiUrl}/laboratory`;
  const assignmentsApiUrl = `${environment.apiUrl}/assignment`;

  const mockLabs: Laboratory[] = [
    { id: 1, name: 'Lab Central', address: 'Calle 1', phone: '+56911111111', status: 'ACTIVO' },
    { id: 2, name: 'Lab Hema', address: 'Calle 2', phone: '+56922222222', status: 'INACTIVO' }
  ];
  const newLab: Laboratory = { name: 'Lab Nuevo', address: 'Calle 3', phone: '+56933333333', status: 'ACTIVO' };
  const newAssignment: AssignmentRequest = { laboratoryId: 2, userId: 202 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LabService]
    });
    service = TestBed.inject(LabService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });


  it('findAll() debería obtener todos los laboratorios (GET /api/laboratory)', () => {
    service.findAll().subscribe(labs => {
      expect(labs).toEqual(mockLabs);
    });

    const req = httpTestingController.expectOne(labsApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLabs);
  });

  it('create() debería enviar un nuevo laboratorio (POST /api/laboratory)', () => {
    const labResponse: Laboratory = { ...newLab, id: 3 };

    service.create(newLab).subscribe(lab => {
      expect(lab).toEqual(labResponse);
    });

    const req = httpTestingController.expectOne(labsApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLab);
    req.flush(labResponse);
  });

  it('update() debería actualizar un laboratorio (PUT /api/laboratory/{id})', () => {
    const updatedLab: Laboratory = { ...mockLabs[0], name: 'Central Modificado' };
    const id = 1;

    service.update(id, updatedLab).subscribe(lab => {
      expect(lab).toEqual(updatedLab);
    });

    const req = httpTestingController.expectOne(`${labsApiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedLab);
    req.flush(updatedLab);
  });

  it('delete() debería eliminar un laboratorio (DELETE /api/laboratory/{id})', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${labsApiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('assign() debería crear una nueva asignación (POST /api/assignment)', () => {
    const assignmentResponse = { id: 2, ...newAssignment, assignedAt: new Date().toISOString() } as any;

    service.assign(newAssignment).subscribe(assignment => {
      expect(assignment).toEqual(assignmentResponse);
    });

    const req = httpTestingController.expectOne(assignmentsApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAssignment);
    req.flush(assignmentResponse);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalysisResultService, AnalysisResultCreateRequest, AnalysisResultDTO } from './analysis-result.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('AnalysisResultService', () => {
  let service: AnalysisResultService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/analysis-results`;

  const mockResults: AnalysisResultDTO[] = [
    {
      id: 1,
      userId: 10,
      laboratoryId: 5,
      testName: 'Hemograma',
      resultValue: 'Normal',
      units: '',
      status: 'COMPLETED',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      userId: 11,
      laboratoryId: 6,
      testName: 'Glucosa',
      resultValue: '95',
      units: 'mg/dL',
      status: 'COMPLETED',
      createdAt: '2024-01-02T11:00:00Z'
    }
  ];

  const createPayload: AnalysisResultCreateRequest = {
    userId: 10,
    laboratoryId: 5,
    testName: 'Hemograma',
    resultValue: 'Normal',
    status: 'COMPLETED'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalysisResultService]
    });
    service = TestBed.inject(AnalysisResultService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('listAll() debería obtener todos los resultados (GET)', () => {
    service.listAll().subscribe(results => {
      expect(results).toEqual(mockResults);
      expect(results.length).toBe(2);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('getByUser(userId) debería obtener resultados por usuario (GET /by-user/:id)', () => {
    const userId = 10;
    const expected = mockResults.filter(r => r.userId === userId);

    service.getByUser(userId).subscribe(results => {
      expect(results).toEqual(expected);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/by-user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('getByLab(labId) debería obtener resultados por laboratorio (GET /by-lab/:id)', () => {
    const labId = 5;
    const expected = mockResults.filter(r => r.laboratoryId === labId);

    service.getByLab(labId).subscribe(results => {
      expect(results).toEqual(expected);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/by-lab/${labId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });

  it('listByDate(from, to) debería enviar parámetros de consulta (GET /by-date?from&to)', () => {
    const from = '2024-01-01';
    const to = '2024-01-31';
    const expected = mockResults;

    service.listByDate(from, to).subscribe(results => {
      expect(results).toEqual(expected);
    });

    const req = httpTestingController.expectOne(r => r.url === `${apiUrl}/by-date`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('from')).toBe(from);
    expect(req.request.params.get('to')).toBe(to);
    req.flush(expected);
  });

  it('create(payload) debería crear un resultado (POST)', () => {
    const created: AnalysisResultDTO = { id: 3, ...createPayload };

    service.create(createPayload).subscribe(result => {
      expect(result).toEqual(created);
      expect(result.id).toBe(3);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createPayload);
    req.flush(created);
  });

  it('update(id, payload) debería actualizar un resultado (PUT)', () => {
    const id = 1;
    const payload: AnalysisResultCreateRequest = { ...createPayload, resultValue: 'Ajustado' };
    const updated: AnalysisResultDTO = { id, ...payload };

    service.update(id, payload).subscribe(result => {
      expect(result).toEqual(updated);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updated);
  });

  it('delete(id) debería eliminar un resultado (DELETE)', () => {
    const id = 2;

    service.delete(id).subscribe(resp => {
      expect(resp).toBeNull();
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('listAll() debería propagar errores del servidor', () => {
    service.listAll().subscribe({
      next: () => fail('Se esperaba error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpTestingController.expectOne(apiUrl);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
  });
});

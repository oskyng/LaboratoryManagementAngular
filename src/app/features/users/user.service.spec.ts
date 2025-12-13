import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/user`;

  const mockUsers: User[] = [
    { id: 1, fullName: 'Admin', email: 'a@l.cl', role: 'ADMIN', active: true },
    { id: 2, fullName: 'John Doe', email: 'j@l.cl', role: 'LAB_TECH', active: true }
  ];
  const newUser: User = { fullName: 'New User', email: 'n@l.cl', role: 'LAB_TECH', active: true };
  const updatedUser: Partial<User> = { fullName: 'Admin Update', email: 'a@l.cl', role: 'ADMIN', active: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('findAll() debería retornar una lista de usuarios (GET)', () => {
    service.findAll().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getByEmail(email) debería retornar un usuario por su email (GET /api/user/{email})', () => {
    const email = 'a@l.cl';
    const mockUser = mockUsers[0];

    service.getByEmail(email).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${encodeURIComponent(email)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('create(user) debería crear un nuevo usuario (POST)', () => {
    const userWithId: User = { ...newUser, id: 3 } as User;

    service.create(newUser).subscribe(user => {
      expect(user).toEqual(userWithId);
      expect(user.id).toBe(3);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(userWithId);
  });

  it('update(id, user) debería actualizar un usuario existente (PUT)', () => {
    const id = 1;

    const updatedResponse: User = { id, fullName: 'Admin Update', email: 'a@l.cl', role: 'ADMIN', active: true };

    service.update(id, updatedUser).subscribe(user => {
      expect(user).toEqual(updatedResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedResponse);
  });

  it('delete(id) debería eliminar un usuario (DELETE)', () => {
    const id = 1;

    service.delete(id).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('findAll() debería manejar un error de red', () => {
    const errorMsg = 'Error en la conexión con el servidor';

    service.findAll().subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpTestingController.expectOne(apiUrl);
    req.flush(errorMsg, { status: 500, statusText: 'Server Error' });
  });

});

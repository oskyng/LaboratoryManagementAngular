import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/user`;

  const localStorageMock: Record<string, string> = {};
  const setItem = (k: string, v: string) => (localStorageMock[k] = v);
  const getItem = (k: string) => localStorageMock[k] ?? null;
  const clear = () => {
    for (const k of Object.keys(localStorageMock)) delete localStorageMock[k];
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    spyOn(localStorage, 'setItem').and.callFake(setItem as any);
    spyOn(localStorage, 'getItem').and.callFake(getItem as any);
    spyOn(localStorage, 'clear').and.callFake(clear as any);
  });

  afterEach(() => {
    http.verify();
    clear();
  });

  it('login() debe POST /api/user/login y persistir datos', () => {
    const reqBody = { email: 'u@a.cl', password: 'secret' };
    const resBody = { id: 10, fullName: 'User', email: 'u@a.cl', role: 'ADMIN' };

    service.login(reqBody).subscribe(res => {
      expect(res).toEqual(resBody);
      expect(localStorage.getItem('userId')).toBe(String(resBody.id));
      expect(localStorage.getItem('fullName')).toBe(resBody.fullName);
      expect(localStorage.getItem('email')).toBe(resBody.email);
      expect(localStorage.getItem('role')).toBe(resBody.role);
    });

    const req = http.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqBody);
    req.flush(resBody);
  });

  it('login() debe persistir valores por defecto cuando faltan campos (nullish)', () => {
    const reqBody = { email: 'u@a.cl', password: 'secret' };
    // respuesta con id undefined y sin fullName/email/role
    const resBody: any = { id: undefined };

    // limpiar estado previo
    (localStorage.clear as any)();

    service.login(reqBody).subscribe(res => {
      expect(res).toEqual(resBody);
      // userId se guarda como String(res.id ?? '') => '' cuando id es undefined
      expect(localStorage.getItem('userId')).toBe('');
      // fullName/email/role usan ?? ''
      expect(localStorage.getItem('fullName')).toBe('');
      expect(localStorage.getItem('email')).toBe('');
      expect(localStorage.getItem('role')).toBe('');
    });

    const req = http.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(resBody);
  });

  it('login() no debe persistir nada si la respuesta es null', () => {
    const reqBody = { email: 'u@a.cl', password: 'secret' };

    // limpiamos posibles valores previos
    (localStorage.clear as any)();

    service.login(reqBody).subscribe(res => {
      expect(res).toBeNull();
      expect(localStorage.getItem('email')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });

    const req = http.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('isLoggedIn() y getCurrentUser() deben reflejar estado según localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
    (localStorage.setItem as any)('email', 'x@y.z');
    (localStorage.setItem as any)('userId', '5');
    (localStorage.setItem as any)('fullName', 'X Y');
    (localStorage.setItem as any)('role', 'USER');
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.hasRole('USER')).toBeTrue();
    const u = service.getCurrentUser();
    expect(u).toEqual({ id: 5, fullName: 'X Y', email: 'x@y.z', role: 'USER' });
  });

  it('logout() debe limpiar localStorage', () => {
    (localStorage.setItem as any)('email', 'x@y.z');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('hasRole/hasAnyRole/isRole deben evaluar correctamente roles positivos y negativos', () => {
    // sin rol
    expect(service.hasRole('ADMIN')).toBeFalse();
    expect(service.hasAnyRole('ADMIN', 'USER')).toBeFalse();
    expect(service.isRole('ADMIN')).toBeFalse();

    // rol USER
    (localStorage.setItem as any)('role', 'USER');
    expect(service.hasRole('ADMIN')).toBeFalse();
    expect(service.hasRole('USER')).toBeTrue();
    expect(service.hasAnyRole('ADMIN', 'LAB_TECH')).toBeFalse();
    expect(service.hasAnyRole('ADMIN', 'USER')).toBeTrue();
    expect(service.isRole('USER')).toBeTrue();
  });

  it('register() debe POST /api/user', () => {
    const payload = { fullName: 'New', email: 'n@a.cl', password: '123456', role: 'USER' };
    const response = { id: 99, fullName: 'New', email: 'n@a.cl', role: 'USER' };

    service.register(payload).subscribe(res => {
      expect(res).toEqual(response as any);
    });

    const req = http.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('POST');
    // el servicio descarta username y asegura role por defecto USER si no viene
    expect(req.request.body).toEqual({ fullName: 'New', email: 'n@a.cl', password: '123456', role: 'USER' });
    req.flush(response);
  });

  it('recover() debe devolver observable con mensaje sin hacer HTTP', () => {
    service.recover('a@b.c').subscribe(res => {
      expect(res.message).toContain('recibirás instrucciones');
    });
    // no deben existir requests pendientes
    http.verify();
  });

  it('getCurrentUser() debe retornar id undefined cuando userId es 0', () => {
    (localStorage.setItem as any)('userId', '0');
    const u = service.getCurrentUser();
    expect(u.id).toBeUndefined();
  });
});

import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { roleGuard } from './role.guard';
import { AuthService } from '../../features/auth/auth.service';

describe('roleGuard', () => {
  let authMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  const execGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => roleGuard(...params));

  beforeEach(() => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'hasAnyRole']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    });
    router = TestBed.inject(Router);
  });

  it('redirige a login si no está autenticado', () => {
    authMock.isLoggedIn.and.returnValue(false);
    const result = execGuard({ data: { roles: ['ADMIN'] } } as any, {} as any);
    expect((result as any).toString()).toContain('/auth/login');
  });

  it('permite si no hay roles requeridos', () => {
    authMock.isLoggedIn.and.returnValue(true);
    const result = execGuard({ data: {} } as any, {} as any);
    expect(result).toBeTrue();
  });

  it('permite si el rol está incluido', () => {
    authMock.isLoggedIn.and.returnValue(true);
    authMock.hasAnyRole.and.returnValue(true);
    const result = execGuard({ data: { roles: ['ADMIN', 'DOCTOR'] } } as any, {} as any);
    expect(result).toBeTrue();
  });

  it('redirige a /profile si no tiene rol', () => {
    authMock.isLoggedIn.and.returnValue(true);
    authMock.hasAnyRole.and.returnValue(false);
    const result = execGuard({ data: { roles: ['ADMIN'] } } as any, {} as any);
    expect((result as any).toString()).toContain('/profile');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../features/auth/auth.service';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'hasRole', 'hasAnyRole', 'logout']);
    authMock.isLoggedIn.and.returnValue(true);
    authMock.hasRole.and.returnValue(true);
    authMock.hasAnyRole.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logout debe llamar a auth.logout y navegar a login', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(authMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('userName debe retornar fullName de localStorage si existe', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'fullName') return 'Juan Perez';
      return null;
    });
    expect(component.userName).toBe('Juan Perez');
  });

  it('userName debe retornar username de localStorage si fullName no existe', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'username') return 'juanp';
      return null;
    });
    expect(component.userName).toBe('juanp');
  });
});

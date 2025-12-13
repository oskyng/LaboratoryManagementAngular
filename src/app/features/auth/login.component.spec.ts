import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });

  it('debe deshabilitar submit con formulario inválido', () => {
    component.form.setValue({ email: '', password: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('onSubmit éxito debe navegar a /users', fakeAsync(() => {
    authMock.login.and.returnValue(of({} as any));
    const navSpy = spyOn(router, 'navigate');

    component.form.setValue({ email: 'a@b.c', password: '1234' });
    component.onSubmit();
    tick();

    expect(authMock.login).toHaveBeenCalledWith({ email: 'a@b.c', password: '1234' });
    expect(navSpy).toHaveBeenCalledWith(['/users']);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('onSubmit error debe mostrar mensaje', fakeAsync(() => {
    authMock.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.form.setValue({ email: 'a@b.c', password: 'bad1' });
    component.onSubmit();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.error).toContain('incorrectos');
  }));
});

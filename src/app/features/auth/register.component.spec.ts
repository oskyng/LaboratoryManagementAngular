import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar con formulario inválido', () => {
    component.form.setValue({ fullName: '', email: '', username: '', password: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('onSubmit éxito debe mostrar success y navegar a login', fakeAsync(() => {
    authMock.register.and.returnValue(of({ id: 1 } as any));
    const navSpy = spyOn(router, 'navigate');

    component.form.setValue({ fullName: 'N', email: 'n@a.cl', username: 'n', password: '1234' });
    component.onSubmit();
    tick(1200);

    expect(authMock.register).toHaveBeenCalled();
    expect(component.success).toContain('registrado');
    expect(navSpy).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('onSubmit error debe mostrar mensaje de error', fakeAsync(() => {
    authMock.register.and.returnValue(throwError(() => ({ status: 400 })));

    component.form.setValue({ fullName: 'N', email: 'n@a.cl', username: 'n', password: '1234' });
    component.onSubmit();
    tick();

    expect(component.error).toContain('existe');
  }));
});

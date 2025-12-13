import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let authMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['recover']);

    await TestBed.configureTestingModule({
      imports: [RecoverPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit éxito debe mostrar mensaje', () => {
    authMock.recover.and.returnValue(of({ message: 'ok' }));
    component.form.setValue({ email: 'a@b.c' });
    component.onSubmit();
    expect(component.message).toBe('ok');
    expect(component.error).toBeNull();
  });

  it('onSubmit error debe mostrar error', () => {
    authMock.recover.and.returnValue(throwError(() => ({ status: 404 })));
    component.form.setValue({ email: 'no@no.cl' });
    component.onSubmit();
    expect(component.error).toContain('no existe');
  });
});

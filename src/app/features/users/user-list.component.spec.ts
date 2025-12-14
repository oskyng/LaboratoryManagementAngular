import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../../models/user.model';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let authMock: jasmine.SpyObj<AuthService>;
  const mockUsers: User[] = [
    { id: 1, username: 'admin', fullName: 'Admin', email: 'a@l.cl', role: 'ADMIN', active: true },
    { id: 2, username: 'john', fullName: 'John', email: 'j@l.cl', role: 'LAB_TECH', active: false }
  ];

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj<UserService>('UserService', ['findAll', 'delete']);
    userServiceMock.findAll.and.returnValue(of(mockUsers));
    userServiceMock.delete.and.returnValue(of(void 0));
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['hasAnyRole']);
    authMock.hasAnyRole.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar usuarios', () => {
    component.ngOnInit();
    expect(userServiceMock.findAll).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('newUser debe inicializar selectedUser por defecto', () => {
    component.newUser();
    expect(component.selectedUser).toEqual({
      username: '',
      fullName: '',
      email: '',
      role: 'LAB_TECH',
      active: true
    } as any);
  });

  it('editUser debe clonar y asignar selectedUser', () => {
    const u = mockUsers[0];
    component.editUser(u);
    expect(component.selectedUser).toEqual(u);
    expect(component.selectedUser).not.toBe(u);
  });

  describe('deleteUser', () => {
    let confirmSpy: jasmine.Spy;

    beforeEach(() => {
      confirmSpy = spyOn(window, 'confirm');
    });

    it('no debe borrar si usuario cancela confirm', () => {
      confirmSpy.and.returnValue(false);
      component.deleteUser({ id: 1, username: 'x' } as any);
      expect(userServiceMock.delete).not.toHaveBeenCalled();
    });

    it('no debe borrar si no hay id', () => {
      confirmSpy.and.returnValue(true);
      component.deleteUser({ username: 'x' } as any);
      expect(userServiceMock.delete).not.toHaveBeenCalled();
    });

    it('debe borrar y recargar lista si confirm true e id presente', () => {
      confirmSpy.and.returnValue(true);
      component.deleteUser({ id: 2, username: 'john' } as any);
      expect(userServiceMock.delete).toHaveBeenCalledWith(2);
      expect(userServiceMock.findAll).toHaveBeenCalledTimes(2);
    });
  });

  it('onSaved debe limpiar y recargar', () => {
    component.selectedUser = { id: 1 } as any;
    component.onSaved({ id: 1 } as any);
    expect(component.selectedUser).toBeNull();
    expect(userServiceMock.findAll).toHaveBeenCalled();
  });

  it('onCancelled debe limpiar selectedUser', () => {
    component.selectedUser = { id: 1 } as any;
    component.onCancelled();
    expect(component.selectedUser).toBeNull();
  });

  it('isAdmin debe delegar en AuthService.hasAnyRole("ADMIN")', () => {
    authMock.hasAnyRole.and.returnValue(true);
    expect(component.isAdmin()).toBeTrue();
    expect(authMock.hasAnyRole).toHaveBeenCalledWith('ADMIN');
    authMock.hasAnyRole.and.returnValue(false);
    expect(component.isAdmin()).toBeFalse();
  });
});

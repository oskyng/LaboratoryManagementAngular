import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserFormComponent } from './user-form.component';
import { UserService } from './user.service';
import { SimpleChange } from '@angular/core';
import { User } from '../../models/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj<UserService>('UserService', ['create', 'update']);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch value when user input changes', () => {
    const user: User = { id: 1, username: 'test', fullName: 'Test User', email: 'test@test.com', role: 'ADMIN', active: true };
    component.user = user;
    component.ngOnChanges({
      user: new SimpleChange(null, user, true)
    });
    expect(component.form.value).toEqual(user);
  });

  it('should not submit if form is invalid', () => {
    component.form.patchValue({ username: '' });
    component.onSubmit();
    expect(userServiceMock.create).not.toHaveBeenCalled();
  });

  it('should create user when id is null', () => {
    const user: User = { username: 'test', fullName: 'Test User', email: 'test@test.com', role: 'ADMIN', active: true };
    component.form.patchValue(user);
    userServiceMock.create.and.returnValue(of({ ...user, id: 1 }));
    spyOn(component.saved, 'emit');

    component.onSubmit();

    expect(userServiceMock.create).toHaveBeenCalledWith(jasmine.objectContaining(user));
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should update user when id is present', () => {
    const user: User = { id: 1, username: 'test', fullName: 'Test User', email: 'test@test.com', role: 'ADMIN', active: true };
    component.form.patchValue(user);
    userServiceMock.update.and.returnValue(of(user));
    spyOn(component.saved, 'emit');

    component.onSubmit();

    expect(userServiceMock.update).toHaveBeenCalledWith(1, jasmine.objectContaining(user));
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should set error on failure', () => {
    const user: User = { username: 'test', fullName: 'Test User', email: 'test@test.com', role: 'ADMIN', active: true };
    component.form.patchValue(user);
    userServiceMock.create.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.error).toBe('Error al guardar el usuario.');
    expect(component.loading).toBeFalse();
  });

  it('should emit cancelled when cancel button is clicked', () => {
    spyOn(component.cancelled, 'emit');
    const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
    cancelButton.click();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });
});

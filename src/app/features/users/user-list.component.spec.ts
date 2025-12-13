import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj<UserService>('UserService', ['findAll', 'delete']);
    userServiceMock.findAll.and.returnValue(of([]));
    const authMock = jasmine.createSpyObj<AuthService>('AuthService', ['hasAnyRole']);
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
});

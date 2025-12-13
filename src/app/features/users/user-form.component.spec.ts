import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserFormComponent } from './user-form.component';
import { UserService } from './user.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj<UserService>('UserService', ['create', 'update']);
    userServiceMock.create.and.returnValue(of({} as any));
    userServiceMock.update.and.returnValue(of({} as any));

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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../features/auth/auth.service';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    const authMock = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'hasRole', 'hasAnyRole', 'logout']);
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

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

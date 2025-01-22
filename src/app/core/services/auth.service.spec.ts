import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../shared/interfaces/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'Engineering',
    role: {
      id: '1',
      name: 'Developer',
      permissions: [
        {
          id: '1',
          name: 'view_employees',
          description: 'Can view employees',
        },
      ],
    },
    startDate: new Date('2024-01-01'),
    status: 'active',
  };

  const mockAuthResponse = {
    token: 'mock-token',
    user: {
      ...mockUser,
      startDate: mockUser.startDate.toISOString(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Clear localStorage before each test
    localStorage.clear();

    // Spy on router navigate
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', fakeAsync(() => {
      const credentials = { email: 'john@example.com', password: 'password' };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
        expect(JSON.parse(localStorage.getItem('user') || '')).toEqual(mockAuthResponse.user);
        expect(service.isAuthenticated()).toBeTrue();
      });

      const req = httpMock.expectOne('/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockAuthResponse);

      tick();
    }));
  });

  describe('logout', () => {
    it('should clear auth state and storage', fakeAsync(() => {
      // Setup initial state
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockAuthResponse.user));
      service['currentUser'].set(mockUser);
      service['authToken'].set('test-token');

      service.logout();
      tick();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    }));
  });

  describe('permission checking', () => {
    beforeEach(() => {
      service['currentUser'].set(mockUser);
    });

    it('should check single permission correctly', () => {
      expect(service.hasPermission('view_employees')).toBeTrue();
      expect(service.hasPermission('invalid_permission')).toBeFalse();
    });

    it('should check multiple permissions correctly', () => {
      expect(service.hasAnyPermission(['view_employees', 'invalid'])).toBeTrue();
      expect(service.hasAnyPermission(['invalid1', 'invalid2'])).toBeFalse();
      expect(service.hasAllPermissions(['view_employees'])).toBeTrue();
      expect(service.hasAllPermissions(['view_employees', 'invalid'])).toBeFalse();
    });
  });
}); 
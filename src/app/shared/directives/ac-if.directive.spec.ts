import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcIfDirective } from './ac-if.directive';
import { AuthService } from '../../core/services/auth.service';

@Component({
  template: `
    <div *acIf="permission">Content</div>
    <div *acIf="permissions">Multiple Permissions</div>
  `,
  standalone: true,
  imports: [AcIfDirective],
})
class TestComponent {
  permission = 'view_employees';
  permissions = ['view_employees', 'edit_employees'];
}

describe('AcIfDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['hasPermission', 'hasAnyPermission']);
    authSpy.hasPermission.and.returnValue(false);
    authSpy.hasAnyPermission.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show content when user has permission', () => {
    authService.hasPermission.and.returnValue(true);
    authService.hasAnyPermission.and.returnValue(true);
    fixture.detectChanges();

    const divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(2);
    expect(divElements[0].textContent).toBe('Content');
  });

  it('should hide content when user does not have permission', () => {
    authService.hasPermission.and.returnValue(false);
    authService.hasAnyPermission.and.returnValue(false);
    fixture.detectChanges();

    const divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(0);
  });

  it('should handle multiple permissions', () => {
    authService.hasPermission.and.returnValue(false);
    authService.hasAnyPermission.and.returnValue(true);
    fixture.detectChanges();

    const divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(1);
    expect(divElements[0].textContent).toBe('Multiple Permissions');
  });

  it('should update view when permissions change', () => {
    // Initially shown
    authService.hasPermission.and.returnValue(true);
    authService.hasAnyPermission.and.returnValue(true);
    fixture.detectChanges();

    let divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(2);

    // Then hidden
    authService.hasPermission.and.returnValue(false);
    authService.hasAnyPermission.and.returnValue(false);
    component.permission = 'invalid_permission';
    fixture.detectChanges();

    divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(0);
  });

  it('should handle permission changes correctly', () => {
    // Start with no permissions
    authService.hasPermission.and.returnValue(false);
    authService.hasAnyPermission.and.returnValue(false);
    fixture.detectChanges();

    let divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(0);

    // Grant single permission
    authService.hasPermission.and.returnValue(true);
    authService.hasAnyPermission.and.returnValue(false);
    component.permission = 'view_employees';
    fixture.detectChanges();

    divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(1);
    expect(divElements[0].textContent.trim()).toBe('Content');

    // Grant multiple permissions
    authService.hasPermission.and.returnValue(true);
    authService.hasAnyPermission.and.returnValue(true);
    fixture.detectChanges();

    divElements = fixture.nativeElement.querySelectorAll('div');
    expect(divElements.length).toBe(2);
  });
}); 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../../shared/interfaces/user.interface';
import {
  Step1Data,
  Step2Data,
  Step3Data,
} from '../../../shared/interfaces/employee.interface';
import { ValidationResponse } from '../../../shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeValidationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  validateStep1(data: Step1Data): Observable<ValidationResponse> {
    const response: ValidationResponse = {
      status: 'success',
      message: 'Step 1 validation successful',
    };
    return of(response).pipe(
      delay(1000) // Simulate network delay
    );
  }

  validateStep2(data: Step2Data): Observable<ValidationResponse> {
    const response: ValidationResponse = {
      status: 'success',
      message: 'Step 2 validation successful',
    };
    return of(response).pipe(
      delay(1000) // Simulate network delay
    );
  }

  validateStep3(data: Step3Data): Observable<ValidationResponse> {
    const response: ValidationResponse = {
      status: 'success',
      message: 'Step 3 validation successful',
    };
    return of(response).pipe(
      delay(1000) // Simulate network delay
    );
  }

  // Helper method to check email uniqueness
  checkEmailUniqueness(email: string): Observable<boolean> {
    return this.http.get<Employee[]>('/employees').pipe(
      map((employees) => !employees.some((emp) => emp.email === email)),
      catchError(() => {
        return of(true);
      })
    );
  }

  // Helper method to validate password strength
  validatePassword(password: string): Observable<ValidationResponse> {
    const requirements = {
      minLength: 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid =
      password.length >= requirements.minLength &&
      requirements.uppercase &&
      requirements.lowercase &&
      requirements.number &&
      requirements.special;

    const response: ValidationResponse = {
      status: isValid ? 'success' : 'error',
      message: isValid
        ? 'Password meets requirements'
        : 'Password does not meet requirements',
      field: 'password',
      requirements,
    };

    return of(response).pipe(delay(500)); // Short delay for better UX
  }
}

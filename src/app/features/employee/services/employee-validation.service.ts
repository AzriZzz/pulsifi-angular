import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
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
  private apiUrl = 'https://mock-pulsifi-json-server.onrender.com/api';

  constructor(private http: HttpClient) {}

  validateStep1(data: Step1Data): Observable<ValidationResponse> {
    // Get validation response from mock database
    return this.http.get<any>(`${this.apiUrl}/validation`).pipe(
      map(response => {
        // Validate the data against requirements
        if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim() || !data.department?.trim()) {
          return response.step1.error;
        }
        return response.step1.success;
      }),
      catchError(error => {
        console.error('Step 1 validation error:', error);
        const response: ValidationResponse = {
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
          field: 'form'
        };
        return of(response);
      })
    );
  }

  validateStep2(data: Step2Data): Observable<ValidationResponse> {
    // Get validation response from mock database
    return this.http.get<any>(`${this.apiUrl}/validation`).pipe(
      map(response => {
        // Validate the data against requirements
        if (!data.role?.trim() || !data.startDate?.trim()) {
          return response.step2.error;
        }
        return response.step2.success;
      }),
      catchError(error => {
        console.error('Step 2 validation error:', error);
        const response: ValidationResponse = {
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
          field: 'form'
        };
        return of(response);
      })
    );
  }

  validateStep3(data: Step3Data): Observable<ValidationResponse> {
    // Get validation response from mock database
    return this.http.get<any>(`${this.apiUrl}/validation`).pipe(
      map(response => {
        // Validate the data against requirements
        if (!data.password?.trim() || !data.confirmPassword?.trim() || !data.accessLevel?.trim()) {
          return response.step3.error;
        }
        if (data.password !== data.confirmPassword) {
          const passwordMismatchError: ValidationResponse = {
            status: 'error',
            message: 'Passwords do not match',
            field: 'confirmPassword'
          };
          return passwordMismatchError;
        }
        return response.step3.success;
      }),
      catchError(error => {
        console.error('Step 3 validation error:', error);
        const response: ValidationResponse = {
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
          field: 'form'
        };
        return of(response);
      })
    );
  }

  // Helper method to check email uniqueness
  checkEmailUniqueness(email: string): Observable<boolean> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      map(employees => !employees.some(emp => emp.email === email)),
      catchError(error => {
        console.error('Email uniqueness check error:', error);
        return of(true); // Assume email is unique in case of error to not block the user
      })
    );
  }

  // Helper method to validate password strength
  validatePassword(password: string): Observable<ValidationResponse> {
    return this.http.get<any>(`${this.apiUrl}/validation`).pipe(
      map(response => {
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

        if (!isValid) {
          const passwordError: ValidationResponse = {
            ...response.step3.error,
            field: 'password',
            requirements
          };
          return passwordError;
        }

        const passwordSuccess: ValidationResponse = {
          ...response.step3.success,
          field: 'password',
          requirements
        };
        return passwordSuccess;
      }),
      catchError(error => {
        console.error('Password validation error:', error);
        const response: ValidationResponse = {
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
          field: 'password'
        };
        return of(response);
      })
    );
  }
}

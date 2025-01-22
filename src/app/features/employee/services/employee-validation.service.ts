import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ValidationResponse {
  status: 'success' | 'error';
  message: string;
  field?: string;
  fields?: string[];
  requirements?: {
    minLength: number;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeValidationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  validateStep1(data: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/validation/step1`, data).pipe(
      delay(3000) // Simulate network delay
    );
  }

  validateStep2(data: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/validation/step2`, data).pipe(
      delay(3000)
    );
  }

  validateStep3(data: any): Observable<ValidationResponse> {
    return this.http.post<ValidationResponse>(`${this.apiUrl}/validation/step3`, data).pipe(
      delay(3000)
    );
  }

  // Helper method to check email uniqueness
  checkEmailUniqueness(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`).pipe(
      map(employees => !employees.some(emp => emp.email === email)),
      delay(1000) // Shorter delay for better UX
    );
  }

  // Helper method to validate password strength
  validatePassword(password: string): Observable<ValidationResponse> {
    const requirements = {
      minLength: 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = password.length >= requirements.minLength &&
      requirements.uppercase &&
      requirements.lowercase &&
      requirements.number &&
      requirements.special;

    const response: ValidationResponse = {
      status: isValid ? 'success' : 'error',
      message: isValid ? 'Password meets requirements' : 'Password does not meet requirements',
      field: 'password',
      requirements
    };

    return of(response).pipe(delay(500)); // Short delay for better UX
  }
} 
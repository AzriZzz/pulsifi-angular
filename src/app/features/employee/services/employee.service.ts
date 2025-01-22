import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../../shared/interfaces/user.interface';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>('/employees').pipe(
      map(employees => employees.map(employee => ({
        ...employee,
        startDate: new Date(employee.startDate)
      })))
    );
  }

  getEmployee(id: string): Observable<User> {
    return this.http.get<User>(`/employees/${id}`).pipe(
      map(employee => ({
        ...employee,
        startDate: new Date(employee.startDate)
      }))
    );
  }

  createEmployee(employee: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('/employees', employee).pipe(
      map(newEmployee => ({
        ...newEmployee,
        startDate: new Date(newEmployee.startDate)
      }))
    );
  }

  updateEmployee(id: string, employee: Partial<User>): Observable<User> {
    return this.http.put<User>(`/employees/${id}`, employee).pipe(
      map(updatedEmployee => ({
        ...updatedEmployee,
        startDate: new Date(updatedEmployee.startDate)
      }))
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`/employees/${id}`);
  }
} 
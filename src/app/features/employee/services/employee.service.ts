import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../../shared/interfaces/user.interface';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>('/employees').pipe(
      map(employees => employees.map(emp => ({
        ...emp,
        startDate: emp.startDate ? new Date(emp.startDate) : null
      })))
    );
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get<any>(`/employees/${id}`).pipe(
      map(employee => ({
        ...employee,
        startDate: employee.startDate ? new Date(employee.startDate) : null
      }))
    );
  }

  createEmployee(employeeData: any): Observable<any> {
    // Combine all form data into a single employee object
    const employee = {
      id: crypto.randomUUID(), // Generate a unique ID
      firstName: employeeData.step1.firstName,
      lastName: employeeData.step1.lastName,
      email: employeeData.step1.email,
      department: employeeData.step1.department,
      role: {
        name: employeeData.step2.role,
        permissions: ['view_public', 'edit_profile', 'view_employees'] // Default permissions
      },
      startDate: employeeData.step2.startDate,
      status: employeeData.step2.status
    };
    return this.http.post('/employees', employee);
  }

  updateEmployee(id: string, employee: any): Observable<any> {
    return this.http.put(`/employees/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`/employees/${id}`);
  }
} 
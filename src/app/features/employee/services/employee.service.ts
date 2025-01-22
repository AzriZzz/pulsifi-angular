import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee, UserRole } from '../../../shared/interfaces/user.interface';
import { WizardFormData } from '../../../shared/interfaces/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('/employees').pipe(
      map((employees) =>
        employees.map((emp) => ({
          ...emp,
          startDate: emp.startDate
            ? new Date(emp.startDate).toISOString()
            : null,
        }))
      )
    );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`/employees/${id}`).pipe(
      map((employee) => ({
        ...employee,
        startDate: employee.startDate
          ? new Date(employee.startDate).toISOString()
          : null,
      }))
    );
  }

  createEmployee(formData: WizardFormData): Observable<Employee> {
    const employee: Omit<Employee, 'id'> = {
      firstName: formData.step1.firstName,
      lastName: formData.step1.lastName,
      email: formData.step1.email,
      department: formData.step1.department,
      role: {
        id: crypto.randomUUID(),
        name: formData.step2.role,
        permissions: ['view_public', 'edit_profile', 'view_employees'].map(
          (name) => ({
            id: crypto.randomUUID(),
            name,
            description: `Permission to ${name}`,
          })
        ),
      },
      startDate: formData.step2.startDate,
      status: formData.step2.status,
    };
    return this.http.post<Employee>('/employees', {
      ...employee,
      id: crypto.randomUUID(),
    });
  }

  updateEmployee(id: string, updates: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`/employees/${id}`, updates);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`/employees/${id}`);
  }
}

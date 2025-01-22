import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../employee/services/employee.service';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="employees-container">
      <div class="header">
        <h1>Employees</h1>
        <button 
          nz-button 
          nzType="primary"
          *ngIf="canManageEmployees"
          (click)="addEmployee()">
          <i nz-icon nzType="plus"></i>
          Add Employee
        </button>
      </div>
      <nz-table #basicTable [nzData]="employees()" [nzLoading]="loading()">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of basicTable.data">
            <td>{{ employee.firstName }} {{ employee.lastName }}</td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.role.name }}</td>
            <td>
              <nz-tag [nzColor]="employee.status === 'active' ? 'success' : 'error'">
                {{ employee.status | titlecase }}
              </nz-tag>
            </td>
            <td>
              <button 
                nz-button 
                nzType="link" 
                *ngIf="canManageEmployees"
                (click)="editEmployee(employee.id)">
                <i nz-icon nzType="edit"></i>
              </button>
              <button 
                nz-button 
                nzType="link" 
                nzDanger
                *ngIf="canManageEmployees"
                nz-popconfirm
                nzPopconfirmTitle="Are you sure you want to delete this employee?"
                (nzOnConfirm)="deleteEmployee(employee.id)">
                <i nz-icon nzType="delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .employees-container {
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0;
    }
    :host ::ng-deep .ant-table-tbody > tr > td {
      vertical-align: middle;
    }
  `]
})
export class EmployeesComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private message = inject(NzMessageService);

  readonly employees = signal<User[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.loadEmployees();
  }

  get canManageEmployees(): boolean {
    return this.authService.hasPermission('manage_employees');
  }

  private loadEmployees(): void {
    console.log('Loading employees...');
    this.loading.set(true);
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        console.log('Employees loaded:', employees);
        this.employees.set(employees);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.message.error('Failed to load employees. Please try again.');
        this.loading.set(false);
      }
    });
  }

  addEmployee(): void {
    void this.router.navigate(['/employees/add']);
  }

  editEmployee(id: string): void {
    void this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(id: string): void {
    this.loading.set(true);
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.message.success('Employee deleted successfully');
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.message.error('Failed to delete employee. Please try again.');
        this.loading.set(false);
      }
    });
  }
} 
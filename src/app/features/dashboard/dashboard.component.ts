import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../employee/services/employee.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzAlertModule,
  ],
  template: `
    <div class="dashboard-container">
      <nz-alert
        nzType="info"
        nzMessage="Informational Notes"
        nzDescription="Welcome to the dashboard. Here you can see the total number of employees, departments, and roles. This pages can be accessed both by admins and employees."
        nzShowIcon
      ></nz-alert>
      <h1 class="text-2xl font-semibold pt-6">Welcome, {{ userName }}!</h1>
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="totalEmployees()"
              [nzTitle]="'Total Employees'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="totalDepartments()"
              [nzTitle]="'Departments'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="totalRoles()"
              [nzTitle]="'Roles'"
            ></nz-statistic>
          </nz-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
      }
      h1 {
        margin-bottom: 24px;
      }
      nz-card {
        margin-bottom: 24px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);

  readonly totalEmployees = signal<number>(0);
  readonly totalDepartments = signal<number>(0);
  readonly totalRoles = signal<number>(0);

  ngOnInit(): void {
    this.loadTotalEmployees();
  }

  private loadTotalEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.totalEmployees.set(employees.length);

      const departments = new Set(employees.map((emp) => emp.department));
      this.totalDepartments.set(departments.size);

      const roles = new Set(
        employees
          .filter((emp) => emp.role && emp.role.name)
          .map((emp) => emp.role.name)
      );
      this.totalRoles.set(roles.size);
    });
  }

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  }
}

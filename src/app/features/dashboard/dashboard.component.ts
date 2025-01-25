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
      <div class="header">
        <h1 class="text-2xl font-semibold">Dashboard</h1>
      </div>
      <nz-alert
        *ngIf="isAlertVisible()"
        nzType="info"
        nzCloseable
        (nzOnClose)="afterClose()"
        nzMessage="Informational Notes"
        nzDescription="Welcome back, {{
          userName
        }}! Here you can see the total number of employees, departments, and roles."
        nzShowIcon
        class="py-4"
      ></nz-alert>

      <div class="content">
      <div nz-row [nzGutter]="[16, 16]">
        <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="totalEmployees()"
              [nzTitle]="'Total Employees'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="8">
          <nz-card>
            <nz-statistic
              [nzValue]="totalDepartments()"
              [nzTitle]="'Departments'"
            ></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="8">
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
        background: #f0f2f5;
        min-height: 100vh;
        @media (max-width: 768px) {
          padding: 0;
        }
      }
      
      .content {
        padding:24px 0 ;
      }

      :host ::ng-deep {
        .ant-card {
          margin-bottom: 0;
        }

        .ant-statistic {
          text-align: center;
        }

        .ant-statistic-title {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.85);
        }

        .ant-statistic-content {
          font-size: 24px;
          font-weight: 600;
        }
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
  readonly isAlertVisible = signal<boolean>(true);

  constructor() {
    const alertHidden = localStorage.getItem('dashboard-alert') === 'true';
    this.isAlertVisible.set(!alertHidden);
  }

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

  afterClose(): void {
    localStorage.setItem('dashboard-alert', 'true');
    this.isAlertVisible.set(false);
  }
}

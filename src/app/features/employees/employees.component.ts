import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTableModule, NzTableSortOrder } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../employee/services/employee.service';
import { Employee } from '../../shared/interfaces/user.interface';
import {
  EmployeeFilterService,
  EmployeeFilterState,
} from './services/employee-filter.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { EmployeeEditModalComponent } from './components/employee-edit-modal.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzModalModule,
    EmployeeEditModalComponent
  ],
  template: `
    <div class="employees-container">
      <div class="header">
        <h1 class="text-2xl font-semibold">Employees</h1>
        <div class="header-actions">
          <button
            nz-button
            nzType="primary"
            *ngIf="canManageEmployees"
            (click)="addEmployee()"
          >
            <i nz-icon nzType="plus"></i>
            Add Employee
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filters-header">
          <h2 class="text-lg font-medium">Filters</h2>
        </div>

        <div class="filters-content">
          <input
            nz-input
            placeholder="Search by name"
            [(ngModel)]="nameFilter"
            (ngModelChange)="applyFilters()"
          />

          <nz-select
            nzPlaceHolder="Department"
            [(ngModel)]="departmentFilter"
            (ngModelChange)="applyFilters()"
          >
            <nz-option nzValue="" nzLabel="All Departments"></nz-option>
            <nz-option
              *ngFor="let dept of departments()"
              [nzValue]="dept"
              [nzLabel]="dept"
            ></nz-option>
          </nz-select>

          <nz-select
            nzPlaceHolder="Role"
            [(ngModel)]="roleFilter"
            (ngModelChange)="applyFilters()"
          >
            <nz-option nzValue="" nzLabel="All Roles"></nz-option>
            <nz-option
              *ngFor="let role of roles()"
              [nzValue]="role"
              [nzLabel]="role"
            ></nz-option>
          </nz-select>

          <nz-select
            nzPlaceHolder="Status"
            [(ngModel)]="statusFilter"
            (ngModelChange)="applyFilters()"
          >
            <nz-option nzValue="" nzLabel="All Status"></nz-option>
            <nz-option nzValue="active" nzLabel="Active"></nz-option>
            <nz-option nzValue="inactive" nzLabel="Inactive"></nz-option>
          </nz-select>

          <nz-range-picker
            [(ngModel)]="dateRange"
            (ngModelChange)="applyFilters()"
            [nzAllowClear]="true"
            nzPlaceHolder="['Start Date', 'End Date']"
          ></nz-range-picker>
        </div>

        <div class="filters-actions">
          <button
            nz-button
            (click)="clearFilters()"
            [disabled]="!hasActiveFilters()"
          >
            <i nz-icon nzType="clear" nzTheme="outline"></i>

            Clear Filters
          </button>
        </div>
      </div>

      <nz-table
        #basicTable
        [nzData]="filteredEmployees()"
        [nzLoading]="loading()"
        [nzPageSize]="pageSize"
        [nzPageSizeOptions]="[5, 10, 25]"
        [nzShowSizeChanger]="true"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th
              nzColumnKey="startDate"
              [nzSortFn]="true"
              [nzSortOrder]="dateSortOrder"
              (nzSortOrderChange)="onDateSort($event)"
            >
              Start Date
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let employee of basicTable.data">
            <td>{{ employee.firstName }} {{ employee.lastName }}</td>
            <td>{{ employee.department }}</td>
            <td>{{ employee.role?.name || '-' }}</td>
            <td>
              <nz-tag
                [nzColor]="employee.status === 'active' ? 'success' : 'error'"
              >
                {{ employee.status | titlecase }}
              </nz-tag>
            </td>
            <td>{{ employee.startDate | date : 'mediumDate' }}</td>
            <td>
              <button
                nz-button
                nzType="link"
                *ngIf="canManageEmployees"
                (click)="editEmployee(employee.id)"
              >
                <i nz-icon nzType="edit"></i>
              </button>
              <button
                nz-button
                nzType="link"
                nzDanger
                *ngIf="canManageEmployees"
                nz-popconfirm
                nzPopconfirmTitle="Are you sure you want to delete this employee?"
                (nzOnConfirm)="deleteEmployee(employee.id)"
              >
                <i nz-icon nzType="delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [
    `
      .employees-container {
        padding: 24px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .header-actions {
        display: flex;
        gap: 16px;
      }
      .filters {
        background: #fff;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 24px;
      }
      .filters-header {
        margin-bottom: 16px;
      }
      .filters-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
      }
      .filters-content > * {
        width: 100%;
      }
      .filters-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
      nz-range-picker {
        width: 100% !important;
      }
      h1,
      h2 {
        margin: 0;
      }
      :host ::ng-deep .ant-table-tbody > tr > td {
        vertical-align: middle;
      }
    `,
  ],
})
export class EmployeesComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private message = inject(NzMessageService);
  private filterService = inject(EmployeeFilterService);
  private modal = inject(NzModalService);

  readonly employees = signal<Employee[]>([]);
  readonly filteredEmployees = signal<Employee[]>([]);
  readonly loading = signal(true);
  readonly departments = signal<string[]>([]);
  readonly roles = signal<string[]>([]);

  // Filters
  nameFilter = '';
  departmentFilter = '';
  roleFilter = '';
  statusFilter = '';
  pageSize = 10;
  dateSortOrder: NzTableSortOrder = null;
  dateRange: [Date | null, Date | null] = [null, null];

  constructor() {
    this.loadSavedFilterState();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.saveFilterState();
  }

  get canManageEmployees(): boolean {
    return this.authService.hasPermission('manage_employees');
  }

  private loadSavedFilterState(): void {
    const savedState = this.filterService.loadFilterState();
    this.nameFilter = savedState.nameFilter;
    this.departmentFilter = savedState.departmentFilter;
    this.roleFilter = savedState.roleFilter;
    this.statusFilter = savedState.statusFilter;
    this.dateRange = savedState.dateRange;
    this.pageSize = savedState.pageSize;
    this.dateSortOrder = savedState.dateSortOrder;
  }

  private saveFilterState(): void {
    const state: EmployeeFilterState = {
      nameFilter: this.nameFilter,
      departmentFilter: this.departmentFilter,
      roleFilter: this.roleFilter,
      statusFilter: this.statusFilter,
      dateRange: this.dateRange,
      pageSize: this.pageSize,
      dateSortOrder: this.dateSortOrder,
    };
    this.filterService.saveFilterState(state);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.nameFilter ||
      this.departmentFilter ||
      this.roleFilter ||
      this.statusFilter ||
      this.dateRange[0] ||
      this.dateRange[1] ||
      this.dateSortOrder
    );
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.departmentFilter = '';
    this.roleFilter = '';
    this.statusFilter = '';
    this.dateRange = [null, null];
    this.dateSortOrder = null;
    this.filterService.clearFilterState();
    this.applyFilters();
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.updateFilterOptions(employees);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.message.error('Failed to load employees. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private updateFilterOptions(employees: Employee[]): void {
    const departments = new Set(employees.map((emp) => emp.department));
    const roles = new Set(
      employees
        .filter(emp => emp.role && emp.role.name)
        .map((emp) => emp.role.name)
    );

    this.departments.set(Array.from(departments));
    this.roles.set(Array.from(roles));
  }

  applyFilters(): void {
    let filtered = this.employees();

    if (this.nameFilter) {
      const searchTerm = this.nameFilter.toLowerCase();
      filtered = filtered.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm)
      );
    }

    if (this.departmentFilter) {
      filtered = filtered.filter(
        (emp) => emp.department === this.departmentFilter
      );
    }

    if (this.roleFilter) {
      filtered = filtered.filter((emp) => emp.role?.name === this.roleFilter);
    }

    if (this.statusFilter) {
      filtered = filtered.filter((emp) => emp.status === this.statusFilter);
    }

    // Date range filter
    if (this.dateRange[0] && this.dateRange[1]) {
      const startDate = this.dateRange[0].getTime();
      const endDate = this.dateRange[1].getTime();
      filtered = filtered.filter((emp) => {
        if (!emp.startDate) return false;
        const empDate = new Date(emp.startDate).getTime();
        return empDate >= startDate && empDate <= endDate;
      });
    }

    if (this.dateSortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return this.dateSortOrder === 'ascend' ? dateA - dateB : dateB - dateA;
      });
    }

    this.filteredEmployees.set(filtered);
    this.saveFilterState();
  }

  onDateSort(order: NzTableSortOrder): void {
    this.dateSortOrder = order;
    this.applyFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.saveFilterState();
  }

  addEmployee(): void {
    void this.router.navigate(['/employees/add']);
  }

  editEmployee(id: string): void {
    const employee = this.employees().find(emp => emp.id === id);
    if (!employee) {
      this.message.error('Employee not found');
      return;
    }

    const modalRef = this.modal.create<EmployeeEditModalComponent>({
      nzTitle: 'Edit Employee',
      nzContent: EmployeeEditModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzData: {
        employee,
        departments: this.departments(),
        roles: this.roles()
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
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
      },
    });
  }
}

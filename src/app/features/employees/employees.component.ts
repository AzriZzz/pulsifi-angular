import {
  Component,
  inject,
  signal,
  OnDestroy,
  HostListener,
} from '@angular/core';
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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../employee/services/employee.service';
import { Employee } from '../../shared/interfaces/user.interface';
import {
  EmployeeFilterService,
  EmployeeFilterState,
} from './services/employee-filter.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { EmployeeEditModalComponent } from './components/employee-edit-modal.component';
import { AcIfDirective } from '../../shared/directives/ac-if.directive';

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
    NzRadioModule,
    AcIfDirective,
  ],
  template: `
    <div class="employees-container">
      <div class="header">
        <h1 class="text-2xl font-semibold">Employees</h1>
        <div class="header-actions">
          <button
            nz-button
            nzType="primary"
            *acIf="'manage_employees'"
            (click)="addEmployee()"
          >
            <i nz-icon nzType="plus"></i>
            Add Employee
          </button>
        </div>
      </div>

      <div class="filters-card">
        <div class="filters-header">
          <h2 class="text-lg font-medium">Filters</h2>
        </div>

        <div class="filters-row">
          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Name</label>
              <input
                nz-input
                placeholder="Search by name"
                [(ngModel)]="nameFilter"
                (ngModelChange)="applyFilters()"
              />
            </div>

            <div class="filter-item">
              <label class="filter-label">Department</label>
              <nz-select
                nzPlaceHolder="All Departments"
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
            </div>

            <div class="filter-item">
              <label class="filter-label">Role</label>
              <nz-select
                nzPlaceHolder="All Roles"
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
            </div>

            <div class="filter-item">
              <label class="filter-label">Status</label>
              <div class="status-filter">
                <nz-radio-group
                  [(ngModel)]="statusFilter"
                  (ngModelChange)="applyFilters()"
                >
                  <label nz-radio [nzValue]="">All</label>
                  <label nz-radio nzValue="active">Active</label>
                  <label nz-radio nzValue="inactive">Inactive</label>
                </nz-radio-group>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Date Range</label>
              <nz-range-picker
                [(ngModel)]="dateRange"
                (ngModelChange)="applyFilters()"
                [nzAllowClear]="true"
                nzPlaceHolder="['Start Date', 'End Date']"
              ></nz-range-picker>
            </div>

            <div class="filter-item clear-filters-container">
              <button
                nz-button
                class="clear-filters-btn"
                (click)="clearFilters()"
                [disabled]="!hasActiveFilters()"
              >
                <i nz-icon nzType="clear" nzTheme="outline"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-container">
        <nz-table
          #basicTable
          [nzData]="filteredEmployees()"
          [nzLoading]="loading()"
          [nzPageSize]="pageSize"
          [nzPageSizeOptions]="[5, 10, 25]"
          [nzShowSizeChanger]="true"
          [nzScroll]="{ x: '800px' }"
          (nzPageSizeChange)="onPageSizeChange($event)"
        >
          <thead>
            <tr>
              <!-- <th nzLeft [nzWidth]="nameColumnWidth()">Name</th> -->
              <th nzWidth="150px">Name</th>
              <th nzWidth="150px">Department</th>
              <th nzWidth="150px">Role</th>
              <th nzWidth="120px">Status</th>
              <th
                nzWidth="150px"
                nzColumnKey="startDate"
                [nzSortFn]="true"
                [nzSortOrder]="dateSortOrder"
                (nzSortOrderChange)="onDateSort($event)"
              >
                Start Date
              </th>
              <th
                *acIf="'manage_employees'"
                nzRight
                nzWidth="80px"
                class="actions-column"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let employee of basicTable.data">
              <!-- <td nzLeft>{{ employee.firstName }} {{ employee.lastName }}</td> -->
              <td>{{ employee.firstName }} {{ employee.lastName }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.role.name || '-' }}</td>
              <td>
                <nz-tag
                  [nzColor]="employee.status === 'active' ? 'success' : 'error'"
                >
                  {{ employee.status | titlecase }}
                </nz-tag>
              </td>
              <td>{{ employee.startDate | date : 'mediumDate' }}</td>
              <td *acIf="'manage_employees'" nzRight class="actions-column">
                <button
                  nz-button
                  nzType="link"
                  (click)="editEmployee(employee.id)"
                >
                  <i nz-icon nzType="edit"></i>
                </button>
                <button
                  nz-button
                  nzType="link"
                  nzDanger
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
    </div>
  `,
  styles: [
    `
      .employees-container {
        padding: 24px;
        background: #f0f2f5;
        min-height: 100vh;

        @media (max-width: 768px) {
          padding: 0;
        }
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
      .filters-card {
        background: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        margin-bottom: 24px;
      }
      .filters-header {
        margin-bottom: 20px;
      }
      .filters-row {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .filter-group {
        display: flex;
        gap: 16px;
        align-items: flex-end;
        flex-wrap: wrap;
      }
      .filter-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        max-width: 300px;
        min-width: 200px;
        @media (max-width: 768px) {
          max-width: 100%;
        }
      }
      .filter-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
      .status-filter {
        margin-top: -4px;
      }
      .clear-filters-container {
        flex: 0 0 auto;
        max-width: none;
        align-self: flex-end;
        margin-left: auto;
      }
      .table-container {
        margin-top: 24px;
        padding: 24px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      }

      :host ::ng-deep {
        .ant-select,
        .ant-picker {
          width: 100%;
        }
        .ant-radio-group {
          display: flex;
          gap: 16px;
        }
        .ant-table {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        .ant-table-thead > tr > th {
          background: #fafafa;
        }
        .ant-table-cell-fix-left,
        .ant-table-cell-fix-right {
          background: #ffffff;
        }
        .ant-table-tbody > tr:hover > td {
          &.ant-table-cell-fix-left,
          &.ant-table-cell-fix-right {
            background: #fafafa;
          }
        }
      }
      .actions-column {
        text-align: right;
        white-space: nowrap;
      }
      h1,
      h2 {
        margin: 0;
        color: rgba(0, 0, 0, 0.85);
      }
      nz-radio-group {
        display: flex;
        gap: 0px !important;
        @media (max-width: 768px) {
          gap: 16px !important;
        }
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
  statusFilter = ''; // Empty string corresponds to "All"
  pageSize = 10;
  dateSortOrder: NzTableSortOrder = null;
  dateRange: [Date | null, Date | null] = [null, null];

  readonly nameColumnWidth = signal('300px');

  constructor() {
    this.loadSavedFilterState();
    this.loadEmployees();
    this.updateNameColumnWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateNameColumnWidth();
  }

  private updateNameColumnWidth(): void {
    const width = window.innerWidth;
    if (width <= 768) {
      this.nameColumnWidth.set('100px');
    } else if (width <= 1024) {
      this.nameColumnWidth.set('200px');
    } else {
      this.nameColumnWidth.set('300px');
    }
  }

  ngOnDestroy(): void {
    this.saveFilterState();
  }

  private loadSavedFilterState(): void {
    const savedState = this.filterService.loadFilterState();
    this.nameFilter = savedState.nameFilter;
    this.departmentFilter = savedState.departmentFilter;
    this.roleFilter = savedState.roleFilter;
    this.statusFilter = savedState.statusFilter || '';
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
        .filter((emp) => emp.role && emp.role.name)
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
    const employee = this.employees().find((emp) => emp.id === id);
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
        roles: this.roles(),
      },
    });

    modalRef.afterClose.subscribe((result) => {
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

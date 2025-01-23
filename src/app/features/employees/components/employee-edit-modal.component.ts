import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Employee } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../employee/services/employee.service';

@Component({
  selector: 'app-employee-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6">First Name</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <input nz-input formControlName="firstName" placeholder="First Name" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">Last Name</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <input nz-input formControlName="lastName" placeholder="Last Name" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">Email</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <input nz-input formControlName="email" placeholder="Email" type="email" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">Password</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <input nz-input formControlName="password" placeholder="Leave blank to keep current password" type="password" />
        </nz-form-control>
      </nz-form-item>

      <ng-container *ngIf="canEditAllFields">
        <nz-form-item>
          <nz-form-label [nzSpan]="6">Department</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-select formControlName="department">
              <nz-option *ngFor="let dept of departments" [nzValue]="dept" [nzLabel]="dept"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">Role</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-select formControlName="role">
              <nz-option *ngFor="let role of roles" [nzValue]="role" [nzLabel]="role"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">Status</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-select formControlName="status">
              <nz-option nzValue="active" nzLabel="Active"></nz-option>
              <nz-option nzValue="inactive" nzLabel="Inactive"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">Start Date</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <nz-date-picker formControlName="startDate"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>
      </ng-container>

      <div class="modal-footer">
        <button nz-button (click)="onCancel()">Cancel</button>
        <button nz-button nzType="primary" type="submit" [disabled]="!form.valid">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .modal-footer {
      margin-top: 24px;
      text-align: right;
      button {
        margin-left: 8px;
      }
    }
  `]
})
export class EmployeeEditModalComponent {
  private fb = inject(FormBuilder);
  private modal = inject(NzModalRef);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private message = inject(NzMessageService);

  employee!: Employee;
  departments: string[] = [];
  roles: string[] = [];
  form: FormGroup;

  get canEditAllFields(): boolean {
    return this.authService.hasPermission('manage_employees');
  }

  constructor() {
    // Get data passed from the modal
    const modalData = this.modal.getConfig().nzData;
    if (modalData) {
      this.employee = modalData.employee;
      this.departments = modalData.departments;
      this.roles = modalData.roles;
    }

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      department: [{ value: '', disabled: !this.canEditAllFields }],
      role: [{ value: '', disabled: !this.canEditAllFields }],
      status: [{ value: '', disabled: !this.canEditAllFields }],
      startDate: [{ value: null, disabled: !this.canEditAllFields }]
    });

    // Initialize form with employee data
    if (this.employee) {
      this.form.patchValue({
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        email: this.employee.email,
        department: this.employee.department,
        role: this.employee.role.name,
        status: this.employee.status,
        startDate: this.employee.startDate ? new Date(this.employee.startDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const updatedEmployee = {
        ...this.employee,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        department: formValue.department,
        status: formValue.status,
        startDate: formValue.startDate,
        role: {
          ...this.employee.role,
          name: formValue.role
        },
        ...(formValue.password ? { password: formValue.password } : {})
      };

      this.employeeService.updateEmployee(this.employee.id, updatedEmployee).subscribe({
        next: () => {
          this.message.success('Employee updated successfully');
          this.modal.close(true);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.message.error('Failed to update employee. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.modal.close();
  }
} 
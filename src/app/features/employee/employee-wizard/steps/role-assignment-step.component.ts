import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../shared/interfaces/employee.interface';
import { RoleAssignment } from '../../../../shared/interfaces/employee.interface';

@Component({
  selector: 'app-role-assignment-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpinModule,
    NzSwitchModule,
  ],
  template: `
    <form
      nz-form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      nzLayout="vertical"
    >
      <nz-spin [nzSpinning]="isValidating">
        <nz-form-item>
          <nz-form-label nzRequired>Role</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please select a role'">
            <nz-select formControlName="role" nzPlaceHolder="Select role">
              <nz-option
                *ngFor="let role of roles"
                [nzValue]="role.name"
                [nzLabel]="role.name"
              >
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Start Date</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please select start date'">
            <nz-date-picker
              formControlName="startDate"
              nzFormat="yyyy-MM-dd"
              [nzDisabledDate]="disabledDate"
            >
            </nz-date-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>Status</nz-form-label>
          <nz-form-control>
            <nz-switch
              formControlName="status"
              [nzCheckedChildren]="'Active'"
              [nzUnCheckedChildren]="'Inactive'"
            >
            </nz-switch>
          </nz-form-control>
        </nz-form-item>
      </nz-spin>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      nz-form-item {
        margin-bottom: 24px;
      }
      nz-date-picker {
        width: 100%;
      }
    `,
  ],
})
export class RoleAssignmentStepComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @Input() initialData: RoleAssignment | null = null;
  @Output() formValid = new EventEmitter<boolean>();
  @Output() formData = new EventEmitter<RoleAssignment>();

  form!: FormGroup;
  isValidating = false;
  roles: Role[] = [];

  ngOnInit() {
    this.loadRoles();

    this.form = this.fb.group({
      role: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      status: [true], // true for active, false for inactive
    });

    if (this.initialData) {
      this.form.patchValue({
        ...this.initialData,
        status: this.initialData.status === 'active',
      });
    }

    // Monitor form validity and emit changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.emit(this.form.valid);
      if (this.form.valid) {
        const formValue = this.form.value;
        const data: RoleAssignment = {
          role: formValue.role,
          startDate: formValue.startDate?.toISOString().split('T')[0] || '',
          status: formValue.status ? 'active' : 'inactive',
        };
        this.formData.emit(data);
      }
    });
  }

  private loadRoles() {
    this.http.get<Role[]>(`${environment.apiUrl}/roles`).subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: () => {
        // Fallback to default roles if API fails
        this.roles = [
          { id: '1', name: 'Admin', permissions: [] },
          { id: '2', name: 'Manager', permissions: [] },
          { id: '3', name: 'Employee', permissions: [] },
        ];
      },
    });
  }

  disabledDate = (current: Date): boolean => {
    // Can't select days before today
    return current && current.getTime() < Date.now() - 24 * 60 * 60 * 1000;
  };

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const data: RoleAssignment = {
        role: formValue.role,
        startDate: formValue.startDate?.toISOString().split('T')[0] || '',
        status: formValue.status ? 'active' : 'inactive',
      };
      this.formData.emit(data);
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}

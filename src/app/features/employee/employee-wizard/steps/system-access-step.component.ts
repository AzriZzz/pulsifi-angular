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
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EmployeeValidationService } from '../../services/employee-validation.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SystemAccess } from '../../../../shared/interfaces/employee.interface';

@Component({
  selector: 'app-system-access-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule,
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
          <nz-form-label nzRequired>Password</nz-form-label>
          <nz-form-control
            [nzErrorTip]="passwordErrorTpl"
            [nzValidatingTip]="'Validating...'"
          >
            <input
              nz-input
              type="password"
              formControlName="password"
              placeholder="Enter password"
            />
            <ng-template #passwordErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                Please input your password
              </ng-container>
              <ng-container *ngIf="control.hasError('minlength')">
                Password must be at least 8 characters
              </ng-container>
              <ng-container *ngIf="control.hasError('pattern')">
                Password must contain at least one uppercase letter, one
                lowercase letter, one number, and one special character
              </ng-container>
              <ng-container *ngIf="control.hasError('passwordRequirements')">
                {{ control.getError('passwordRequirements') }}
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Confirm Password</nz-form-label>
          <nz-form-control [nzErrorTip]="confirmPasswordErrorTpl">
            <input
              nz-input
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirm password"
            />
            <ng-template #confirmPasswordErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                Please confirm your password
              </ng-container>
              <ng-container *ngIf="control.hasError('passwordMismatch')">
                Passwords do not match
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Access Level</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please select access level'">
            <nz-select
              formControlName="accessLevel"
              nzPlaceHolder="Select access level"
            >
              <nz-option nzValue="full" nzLabel="Full Access"></nz-option>
              <nz-option
                nzValue="restricted"
                nzLabel="Restricted Access"
              ></nz-option>
              <nz-option nzValue="readonly" nzLabel="Read Only"></nz-option>
            </nz-select>
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
    `,
  ],
})
export class SystemAccessStepComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validationService = inject(EmployeeValidationService);

  @Input() initialData: SystemAccess | null = null;
  @Output() formValid = new EventEmitter<boolean>();
  @Output() formData = new EventEmitter<SystemAccess>();

  form!: FormGroup;
  isValidating = false;

  ngOnInit() {
    this.form = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        accessLevel: ['', [Validators.required]],
      },
      {
        validators: [this.passwordMatchValidator],
      }
    );

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    // Monitor form validity and emit changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.emit(this.form.valid);
      if (this.form.valid) {
        this.formData.emit(this.form.value);
      }
    });

    // Set up password strength validation
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      passwordControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((password) => {
            if (password) {
              this.isValidating = true;
              return this.validationService.validatePassword(password);
            }
            return [];
          })
        )
        .subscribe({
          next: (response) => {
            if (response && response.status === 'error') {
              passwordControl.setErrors({
                passwordRequirements: response.message,
              });
            }
            this.isValidating = false;
          },
          error: () => {
            this.isValidating = false;
          },
        });
    }
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.formData.emit(this.form.value);
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

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EmployeeValidationService } from '../../services/employee-validation.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSpinModule
  ],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()" nzLayout="vertical">
      <nz-spin [nzSpinning]="isValidating">
        <nz-form-item>
          <nz-form-label nzRequired>First Name</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please input your first name'">
            <input nz-input formControlName="firstName" placeholder="First Name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Last Name</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please input your last name'">
            <input nz-input formControlName="lastName" placeholder="Last Name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Email</nz-form-label>
          <nz-form-control [nzErrorTip]="emailErrorTpl" [nzValidatingTip]="'Checking email...'">
            <input nz-input formControlName="email" placeholder="Email" />
            <ng-template #emailErrorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                Please input your email
              </ng-container>
              <ng-container *ngIf="control.hasError('email')">
                Please enter a valid email address
              </ng-container>
              <ng-container *ngIf="control.hasError('emailTaken')">
                This email is already taken
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Department</nz-form-label>
          <nz-form-control [nzErrorTip]="'Please select department'">
            <nz-select formControlName="department" nzPlaceHolder="Select department">
              <nz-option nzValue="Engineering" nzLabel="Engineering"></nz-option>
              <nz-option nzValue="HR" nzLabel="HR"></nz-option>
              <nz-option nzValue="Finance" nzLabel="Finance"></nz-option>
              <nz-option nzValue="Marketing" nzLabel="Marketing"></nz-option>
              <nz-option nzValue="Sales" nzLabel="Sales"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </nz-spin>
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }
    nz-form-item {
      margin-bottom: 24px;
    }
  `]
})
export class PersonalInfoStepComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validationService = inject(EmployeeValidationService);

  @Input() initialData: PersonalInfo | null = null;
  @Output() formValid = new EventEmitter<boolean>();
  @Output() formData = new EventEmitter<PersonalInfo>();

  form!: FormGroup;
  isValidating = false;

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required]]
    });

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    // Monitor both value and status changes
    this.form.valueChanges.subscribe(() => this.checkAndEmitFormState());
    this.form.statusChanges.subscribe(() => this.checkAndEmitFormState());

    // Set up email uniqueness validation
    const emailControl = this.form.get('email');
    if (emailControl) {
      emailControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => {
          if (email && emailControl.valid && !emailControl.hasError('email')) {
            this.isValidating = true;
            emailControl.setErrors({ validating: true });
            return this.validationService.checkEmailUniqueness(email);
          }
          return [];
        })
      ).subscribe(isUnique => {
        this.isValidating = false;
        if (emailControl.hasError('validating')) {
          if (!isUnique) {
            emailControl.setErrors({ emailTaken: true });
          } else {
            emailControl.setErrors(null);
          }
          this.checkAndEmitFormState();
        }
      });
    }

    // Initial form state emission
    this.checkAndEmitFormState();
  }

  private checkAndEmitFormState() {
    this.formValid.emit(this.form.valid);
    if (this.form.valid) {
      this.formData.emit(this.form.value);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formData.emit(this.form.value);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.checkAndEmitFormState();
    }
  }
} 
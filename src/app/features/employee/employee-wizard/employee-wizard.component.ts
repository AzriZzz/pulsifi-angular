import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { PersonalInfoStepComponent } from './steps/personal-info-step.component';
import { RoleAssignmentStepComponent } from './steps/role-assignment-step.component';
import { SystemAccessStepComponent } from './steps/system-access-step.component';
import { EmployeeValidationService } from '../services/employee-validation.service';
import { finalize } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import {
  WizardStep,
  FormData,
  Step1Data,
  Step2Data,
  Step3Data,
} from '../../../shared/interfaces/employee.interface';

@Component({
  selector: 'app-employee-wizard',
  standalone: true,
  imports: [
    CommonModule,
    NzStepsModule,
    NzButtonModule,
    NzCardModule,
    PersonalInfoStepComponent,
    RoleAssignmentStepComponent,
    SystemAccessStepComponent,
  ],
  template: `
    <nz-card>
      <nz-steps [nzCurrent]="currentStep()">
        <nz-step
          *ngFor="let step of steps(); let i = index"
          [nzTitle]="step.title"
          [nzDescription]="step.description"
          [nzStatus]="getStepStatus(i)"
        ></nz-step>
      </nz-steps>

      <div class="step-content mt-8">
        <ng-container [ngSwitch]="currentStep()">
          <app-personal-info-step
            *ngSwitchCase="0"
            [initialData]="formData().step1"
            (formValid)="updateStepValidity($event)"
            (formData)="updateFormData($event)"
          ></app-personal-info-step>
          <app-role-assignment-step
            *ngSwitchCase="1"
            [initialData]="formData().step2"
            (formValid)="updateStepValidity($event)"
            (formData)="updateFormData($event)"
          ></app-role-assignment-step>
          <app-system-access-step
            *ngSwitchCase="2"
            [initialData]="formData().step3"
            (formValid)="updateStepValidity($event)"
            (formData)="updateFormData($event)"
          ></app-system-access-step>
        </ng-container>
      </div>

      <div class="step-action mt-8 flex justify-between">
        <button nz-button (click)="prev()" *ngIf="currentStep() > 0">
          Previous
        </button>
        <button
          nz-button
          nzType="primary"
          (click)="next()"
          *ngIf="currentStep() < steps().length - 1"
          [disabled]="!currentStepValid() || isValidating()"
        >
          <span *ngIf="isValidating()">Validating...</span>
          <span *ngIf="!isValidating()">Next</span>
        </button>
        <button
          nz-button
          nzType="primary"
          (click)="submit()"
          *ngIf="currentStep() === steps().length - 1"
          [disabled]="!isFormValid() || isValidating()"
        >
          <span *ngIf="isValidating()">Validating...</span>
          <span *ngIf="!isValidating()">Submit</span>
        </button>
      </div>
    </nz-card>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 800px;
        margin: 2rem auto;
      }
      .step-content {
        min-height: 200px;
        padding: 2rem 0;
      }
      .mt-8 {
        margin-top: 2rem;
      }
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
    `,
  ],
})
export class EmployeeWizardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private validationService = inject(EmployeeValidationService);
  private employeeService = inject(EmployeeService);
  private message = inject(NzMessageService);

  // Step management
  readonly steps = signal<WizardStep[]>([
    {
      title: 'Personal Information',
      description: 'Basic details',
      isValid: false,
    },
    {
      title: 'Role Assignment',
      description: 'Department and role',
      isValid: false,
    },
    {
      title: 'System Access',
      description: 'Credentials setup',
      isValid: false,
    },
  ]);
  readonly currentStep = signal(0);
  readonly currentStepValid = computed(() => {
    return this.steps()[this.currentStep()].isValid;
  });
  readonly isValidating = signal(false);

  // Form data signals
  readonly formData = signal<FormData>({
    step1: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
    },
    step2: {
      role: '',
      startDate: '',
      status: 'active',
    },
    step3: {
      password: '',
      confirmPassword: '',
      accessLevel: '',
    },
  });

  constructor() {
    // Check for manage_employees permission
    if (!this.authService.hasPermission('manage_employees')) {
      this.router.navigate(['/']);
    }
  }

  getStepStatus(index: number): string {
    if (index < this.currentStep()) return 'finish';
    if (index === this.currentStep()) return 'process';
    return 'wait';
  }

  updateStepValidity(isValid: boolean) {
    const newSteps = [...this.steps()];
    newSteps[this.currentStep()].isValid = isValid;
    this.steps.set(newSteps);
  }

  updateFormData(data: Step1Data | Step2Data | Step3Data) {
    const currentFormData = this.formData();
    switch (this.currentStep()) {
      case 0:
        currentFormData.step1 = data as Step1Data;
        break;
      case 1:
        currentFormData.step2 = data as Step2Data;
        break;
      case 2:
        currentFormData.step3 = data as Step3Data;
        break;
    }
    this.formData.set(currentFormData);
  }

  prev(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((step) => step - 1);
    }
  }

  async next(): Promise<void> {
    if (
      this.currentStep() < this.steps().length - 1 &&
      this.currentStepValid()
    ) {
      this.isValidating.set(true);

      try {
        await this.validateStep();
        this.currentStep.update((step) => step + 1);
      } catch (error) {
        this.message.error(
          'Validation failed. Please check your input and try again.'
        );
      } finally {
        this.isValidating.set(false);
      }
    }
  }

  private async validateStep(): Promise<void> {
    const currentData = this.formData();
    const step = this.currentStep();

    return new Promise((resolve, reject) => {
      let validation$;

      switch (step) {
        case 0:
          validation$ = this.validationService.validateStep1(currentData.step1);
          break;
        case 1:
          validation$ = this.validationService.validateStep2(currentData.step2);
          break;
        case 2:
          validation$ = this.validationService.validateStep3(currentData.step3);
          break;
        default:
          reject(new Error('Invalid step'));
          return;
      }

      validation$.pipe(finalize(() => this.isValidating.set(false))).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            resolve();
          } else {
            this.message.error(response.message);
            reject(new Error(response.message));
          }
        },
        error: (error) => {
          this.message.error('Network error. Please try again.');
          reject(error);
        },
      });
    });
  }

  isFormValid(): boolean {
    return this.steps().every((step) => step.isValid);
  }

  async submit(): Promise<void> {
    if (this.isFormValid()) {
      this.isValidating.set(true);

      try {
        await this.validateStep();
        // Submit form data
        const formData = this.formData();
        this.employeeService.createEmployee(formData).subscribe({
          next: () => {
            this.message.success('Employee added successfully!');
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            this.message.error('Failed to create employee. Please try again.');
          },
        });
      } catch (error) {
        this.message.error('Submission failed. Please try again.');
      } finally {
        this.isValidating.set(false);
      }
    }
  }
}

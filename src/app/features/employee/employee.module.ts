import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeWizardComponent } from './employee-wizard/employee-wizard.component';
import { PersonalInfoStepComponent } from './employee-wizard/steps/personal-info-step.component';
import { RoleAssignmentStepComponent } from './employee-wizard/steps/role-assignment-step.component';
import { SystemAccessStepComponent } from './employee-wizard/steps/system-access-step.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    EmployeeWizardComponent,
    PersonalInfoStepComponent,
    RoleAssignmentStepComponent,
    SystemAccessStepComponent
  ]
})
export class EmployeeModule { } 
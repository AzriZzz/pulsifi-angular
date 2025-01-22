import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeWizardComponent } from './employee-wizard/employee-wizard.component';
import { EmployeesComponent } from '../employees/employees.component';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent
  },
  {
    path: 'add',
    component: EmployeeWizardComponent,
    canActivate: [() => {
      const authService = inject(AuthService);
      return authService.hasPermission('manage_employees');
    }],
    title: 'Add Employee'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { } 
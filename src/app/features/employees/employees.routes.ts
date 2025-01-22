import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./employees.component').then(m => m.EmployeesComponent),
  }
]; 
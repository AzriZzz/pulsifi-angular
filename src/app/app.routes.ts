import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEE_ROUTES),
        canActivate: [permissionGuard],
        data: { permissions: ['view_employees'] },
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/roles/roles.routes').then(m => m.ROLE_ROUTES),
        canActivate: [permissionGuard],
        data: { permissions: ['manage_roles'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

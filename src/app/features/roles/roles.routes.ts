import { Routes } from '@angular/router';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./roles.component').then(m => m.RolesComponent),
  }
]; 
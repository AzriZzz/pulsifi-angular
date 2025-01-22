import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permissions = route.data?.['permissions'] as string[];

  if (!permissions?.length) {
    return true;
  }

  if (authService.hasAllPermissions(permissions)) {
    return true;
  }

  void router.navigate(['/unauthorized']);
  return false;
}; 
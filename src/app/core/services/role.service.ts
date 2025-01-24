import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserRole, Permission } from '../../shared/interfaces/user.interface';
import { ApiResponse } from '../../shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Signal-based state
  private readonly roles = signal<UserRole[]>([]);
  private readonly permissions = signal<Permission[]>([]);

  // Computed states
  readonly availableRoles = computed(() => this.roles());
  readonly availablePermissions = computed(() => this.permissions());

  // Check if role has specific permission
  hasPermission(role: UserRole, permissionName: string): boolean {
    return role.permissions.some((p) => p.name === permissionName);
  }
}

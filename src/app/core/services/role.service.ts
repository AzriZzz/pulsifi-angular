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

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  // Load initial roles and permissions
  private loadInitialData(): void {
    this.getRoles().subscribe();
    this.getPermissions().subscribe();
  }

  // Get all roles
  getRoles(): Observable<ApiResponse<UserRole[]>> {
    return this.http.get<ApiResponse<UserRole[]>>('/roles').pipe(
      tap(response => {
        this.roles.set(response.data);
      })
    );
  }

  // Get all permissions
  getPermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>('/permissions').pipe(
      tap(response => {
        this.permissions.set(response.data);
      })
    );
  }

  // Get role by ID
  getRoleById(id: string): UserRole | undefined {
    return this.roles().find(role => role.id === id);
  }

  // Create new role
  createRole(role: Omit<UserRole, 'id'>): Observable<ApiResponse<UserRole>> {
    return this.http.post<ApiResponse<UserRole>>('/roles', role).pipe(
      tap(response => {
        this.roles.update(roles => [...roles, response.data]);
      })
    );
  }

  // Update role
  updateRole(id: string, role: Partial<UserRole>): Observable<ApiResponse<UserRole>> {
    return this.http.put<ApiResponse<UserRole>>(`/roles/${id}`, role).pipe(
      tap(response => {
        this.roles.update(roles =>
          roles.map(r => (r.id === id ? response.data : r))
        );
      })
    );
  }

  // Delete role
  deleteRole(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`/roles/${id}`).pipe(
      tap(() => {
        this.roles.update(roles => roles.filter(r => r.id !== id));
      })
    );
  }

  // Add permission to role
  addPermissionToRole(
    roleId: string,
    permissionId: string
  ): Observable<ApiResponse<UserRole>> {
    return this.http
      .post<ApiResponse<UserRole>>(`/roles/${roleId}/permissions`, {
        permissionId,
      })
      .pipe(
        tap(response => {
          this.roles.update(roles =>
            roles.map(r => (r.id === roleId ? response.data : r))
          );
        })
      );
  }

  // Remove permission from role
  removePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Observable<ApiResponse<UserRole>> {
    return this.http
      .delete<ApiResponse<UserRole>>(
        `/roles/${roleId}/permissions/${permissionId}`
      )
      .pipe(
        tap(response => {
          this.roles.update(roles =>
            roles.map(r => (r.id === roleId ? response.data : r))
          );
        })
      );
  }

  // Check if role has specific permission
  hasPermission(role: UserRole, permissionName: string): boolean {
    return role.permissions.some(p => p.name === permissionName);
  }

  // Get permissions for a role
  getRolePermissions(roleId: string): Permission[] {
    const role = this.getRoleById(roleId);
    return role?.permissions || [];
  }
} 
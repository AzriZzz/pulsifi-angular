import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/interfaces/user.interface';
import { AuthResponse, LoginCredentials } from '../../shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal-based state
  private readonly currentUser = signal<User | null>(null);
  private readonly authToken = signal<string | null>(null);

  // Computed states
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userRole = computed(() => this.currentUser()?.role);
  readonly userPermissions = computed(() => this.currentUser()?.role.permissions || []);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.initializeFromStorage();
  }

  // Initialize state from localStorage
  private initializeFromStorage(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        this.clearState();
        return;
      }

      let userData: any;
      try {
        userData = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.clearState();
        this.navigateToLogin();
        return;
      }

      try {
        const user = this.transformUserData(userData);
        // Set token first to ensure isAuthenticated works correctly
        this.authToken.set(token);
        this.currentUser.set(user);
      } catch (e) {
        console.error('Error transforming user data:', e);
        this.clearState();
        this.navigateToLogin();
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
      this.clearState();
      this.navigateToLogin();
    }
  }

  private navigateToLogin(): void {
    // Use Promise.resolve to ensure navigation is handled in the next tick
    Promise.resolve().then(() => {
      void this.router.navigate(['/auth/login']);
    });
  }

  // Transform API user data to User type
  private transformUserData(userData: AuthResponse['user']): User {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data');
    }

    if (!userData.startDate || !userData.role?.permissions) {
      throw new Error('Invalid user data structure');
    }

    return {
      ...userData,
      startDate: new Date(userData.startDate),
      role: {
        ...userData.role,
        permissions: userData.role.permissions.map(p => ({
          ...p,
        })),
      },
    };
  }

  // Clear all state
  private clearState(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.authToken.set(null);
  }

  // Login
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  // Logout
  logout(): void {
    this.clearState();
    void this.router.navigate(['/auth/login']);
  }

  // Set session data
  private setSession(response: AuthResponse): void {
    try {
      const user = this.transformUserData(response.user);
      
      this.authToken.set(response.token);
      this.currentUser.set(user);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Error setting session:', error);
      this.clearState();
      throw error;
    }
  }

  // Permission checking
  hasPermission(permission: string): boolean {
    return this.userPermissions().some(p => p.name === permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Get current auth state
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAuthToken(): string | null {
    return this.authToken();
  }

  // Refresh token - implement if needed
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/refresh', {}).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }
} 
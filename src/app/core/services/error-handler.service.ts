import { Injectable, signal } from '@angular/core';
import { ApiError } from '../../shared/interfaces/api.interface';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly errorState = signal<ApiError | null>(null);
  
  constructor(private message: NzMessageService) {}

  handleError(error: ApiError): void {
    // Update error state
    this.errorState.set(error);

    // Show error message using ng-zorro
    this.showErrorMessage(error);

    // Handle specific error cases
    this.handleSpecificErrors(error);
  }

  private showErrorMessage(error: ApiError): void {
    const message = this.getErrorMessage(error);
    this.message.error(message);
  }

  private getErrorMessage(error: ApiError): string {
    // Handle known error codes
    switch (error.code) {
      case '401':
        return 'Please log in to continue';
      case '403':
        return 'You do not have permission to perform this action';
      case '404':
        return 'The requested resource was not found';
      case '422':
        return 'The provided data is invalid';
      case 'CLIENT_ERROR':
        return 'A network error occurred. Please check your connection';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  private handleSpecificErrors(error: ApiError): void {
    // Handle authentication errors
    if (error.code === '401') {
      // Clear auth state and redirect to login
      localStorage.removeItem('auth_token');
      // TODO: Inject Router and redirect to login
    }

    // Log critical errors
    if (error.code === '500') {
      console.error('Critical server error:', error);
    }
  }

  clearError(): void {
    this.errorState.set(null);
  }
} 
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiError } from '../../shared/interfaces/api.interface';

export function apiInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Add base URL
  const apiReq = request.clone({
    url: `${environment.apiUrl}${request.url}`,
    setHeaders: getHeaders(),
  });

  // Process the request and handle errors
  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = handleError(error);
      return throwError(() => apiError);
    })
  );
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

function handleError(error: HttpErrorResponse): ApiError {
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    return {
      code: 'CLIENT_ERROR',
      message: error.error.message,
    };
  }

  // Server-side error
  return {
    code: error.status.toString(),
    message: error.error?.message || 'An unexpected error occurred',
    details: error.error?.details,
  };
} 
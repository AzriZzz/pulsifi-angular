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
  // Only add base URL if it's not already an absolute URL
  const isAbsoluteUrl = /^https?:\/\//i.test(request.url);
  const url = isAbsoluteUrl ? request.url : `${environment.apiUrl}${request.url}`;

  // console.log('API Request:', {
  //   method: request.method,
  //   url,
  //   body: request.body,
  //   headers: request.headers
  // });

  // Add base URL and headers
  const apiReq = request.clone({
    url,
    setHeaders: getHeaders(),
  });

  // Process the request and handle errors
  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);
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
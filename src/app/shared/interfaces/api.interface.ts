export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Query parameters interface for list endpoints
export interface ListQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  department?: string;
}

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    role: {
      id: string;
      name: string;
      permissions: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    };
    startDate: string;
    status: 'active' | 'inactive';
  };
}

export interface ValidationResponse {
  status: 'success' | 'error';
  message: string;
  field?: string;
  requirements?: {
    minLength: number;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

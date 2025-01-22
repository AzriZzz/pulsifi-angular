export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: UserRole;
  startDate: Date;
  status: 'active' | 'inactive';
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Utility type for creating new users
export type CreateUserDTO = Omit<User, 'id'>;

// Utility type for updating users
export type UpdateUserDTO = Partial<CreateUserDTO>; 
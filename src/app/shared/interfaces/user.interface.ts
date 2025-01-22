export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface Employee extends User {
  department: string;
  startDate: string | null;
  status: 'active' | 'inactive';
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

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id?: string;
    name: string;
    permissions: (string | { id: string; name: string; description: string })[];
  };
  startDate: string;
}

export interface MockUser extends UserData {
  password: string;
}
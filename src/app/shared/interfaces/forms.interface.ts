// Step 1: Personal Information
export interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
}

// Step 2: Role and Department
export interface RoleAssignmentForm {
  department: string;
  role: string;
  startDate: Date;
  reportsTo?: string;
}

// Step 3: System Access
export interface SystemAccessForm {
  username: string;
  initialPassword: string;
  confirmPassword: string;
  accessLevel: string[];
  specialPermissions?: string[];
}

// Combined form type
export interface EmployeeWizardForm {
  personalInfo: PersonalInfoForm;
  roleAssignment: RoleAssignmentForm;
  systemAccess: SystemAccessForm;
}

// Form validation response
export interface FormValidationResponse {
  valid: boolean;
  errors?: {
    [key: string]: string;
  };
  warnings?: {
    [key: string]: string;
  };
} 
export interface WizardFormData {
  step1: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
  };
  step2: {
    role: string;
    startDate: string;
    status: 'active' | 'inactive';
  };
  step3: {
    password: string;
    confirmPassword: string;
    accessLevel: string;
  };
}

export interface WizardStep {
  title: string;
  description: string;
  isValid: boolean;
}

export interface FormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
}

export interface Step1Data {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface Step2Data {
  role: string;
  startDate: string;
  status: 'active' | 'inactive';
}

export interface Step3Data {
  password: string;
  confirmPassword: string;
  accessLevel: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export interface RoleAssignment {
  role: string;
  startDate: string;
  status: 'active' | 'inactive';
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface SystemAccess {
  password: string;
  confirmPassword: string;
  accessLevel: string;
}

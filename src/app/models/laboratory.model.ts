import {User} from "./user.model";

export interface Laboratory {
  id?: number;
  name: string;
  address?: string;
  phone?: string;
  status?: 'ACTIVO' | 'INACTIVO';
}

export interface UserLaboratoryAssignment {
  id?: number;
  user: User;
  laboratory: Laboratory;
  assignedAt?: string; // string con formato date-time
}

export interface AssignmentRequest {
  userId: number;
  laboratoryId: number;
}

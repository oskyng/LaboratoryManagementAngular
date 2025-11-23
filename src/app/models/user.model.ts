export interface User {
  id?: number;
  username: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'LAB_TECH' | 'DOCTOR';
  active: boolean;
}

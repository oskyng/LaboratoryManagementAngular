export interface LabAssignment {
  id?: number;
  labId: number;
  patientId: number;
  examType: string;
  scheduledDate: string; // ISO string
}

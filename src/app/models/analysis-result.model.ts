import { User } from './user.model';
import { Laboratory } from './laboratory.model';

// Define el modelo de Resultado de Análisis (AnalysisResult)
export interface AnalysisResult {
  id?: number;
  user: User;
  laboratory: Laboratory;
  testName: string;
  resultValue?: string;
  units?: string;
  status?: string;
  createdAt?: string;
  attachmentUrl?: string;
  observations?: string;
}

// Define el DTO para solicitar la creación del Resultado (AnalysisResultRequest)
export interface AnalysisResultRequest {
  userId: number;
  laboratoryId: number;
  testName: string;
  resultValue?: string;
  units?: string;
  status?: string;
  attachmentUrl?: string;
  observations?: string;
}

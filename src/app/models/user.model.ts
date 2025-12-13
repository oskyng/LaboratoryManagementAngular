export interface User {
  id?: number;
  fullName: string;
  email: string;
  role: string; // según OpenAPI es un string libre
  password?: string; // usado para creación/actualización cuando aplique
  username?: string; // opcional, mantenido por compatibilidad con UI legacy
  active?: boolean;
}

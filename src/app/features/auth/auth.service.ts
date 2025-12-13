import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, of } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res) {
          localStorage.setItem('userId', String(res.id ?? ''));
          localStorage.setItem('fullName', res.fullName ?? '');
          localStorage.setItem('email', res.email ?? '');
          localStorage.setItem('role', res.role ?? '');
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('email');
  }

  hasRole(role: string): boolean {
    return localStorage.getItem('role') === role;
  }

  hasAnyRole(...roles: string[]): boolean {
    const r = localStorage.getItem('role');
    return !!r && roles.includes(r);
  }

  isRole(role: string): boolean {
    return this.hasRole(role);
  }

  getCurrentUser() {
    return {
      id: Number(localStorage.getItem('userId') ?? 0) || undefined,
      fullName: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role')
    };
  }

  // Registro de usuario según OpenAPI: POST /api/user con UserCreateRequest
  register(data: { fullName: string; email: string; password: string; role?: string; username?: string }): Observable<User> {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role ?? 'USER'
    };
    return this.http.post<User>(`${this.apiUrl}`, payload);
  }

  // Recuperación de contraseña: no existe en OpenAPI, devolvemos una respuesta informativa
  recover(email: string): Observable<{ message: string }> {
    return of({ message: 'Si tu correo está registrado, recibirás instrucciones para recuperar tu contraseña.' });
  }
}

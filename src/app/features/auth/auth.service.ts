import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private users = [
    {
      username: 'admin',
      password: '1234',
      email: 'admin@labs.cl',
      fullName: 'Administrador General',
      role: 'ADMIN'
    },
    {
      username: 'jdoe',
      password: '1234',
      email: 'jdoe@labs.cl',
      fullName: 'John Doe',
      role: 'USER'
    }
  ];

  login(data: { username: string, password: string }): Observable<any> {
    const found = this.users.find(
      u => u.username === data.username && u.password === data.password
    );

    if (!found) return throwError(() => new Error('INVALID_CREDENTIALS'));

    localStorage.setItem('token', 'local-token');
    localStorage.setItem('username', found.username);
    localStorage.setItem('fullName', found.fullName);
    localStorage.setItem('email', found.email);
    localStorage.setItem('role', found.role);

    return of(found);
  }

  register(data: any): Observable<any> {
    const exists = this.users.some(
      u => u.username === data.username || u.email === data.email
    );

    if (exists) return throwError(() => new Error('USER_EXISTS'));

    this.users.push(data);
    return of(data);
  }

  recover(email: string): Observable<any> {
    const exists = this.users.find(u => u.email === email);
    if (!exists) return throwError(() => new Error('EMAIL_NOT_FOUND'));

    return of({ message: 'Correo enviado correctamente.' });
  }

  getCurrentUser() {
    return {
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      fullName: localStorage.getItem('fullName'),
      role: localStorage.getItem('role')
    };
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    return localStorage.getItem('role') === role;
  }

  logout(): void {
    localStorage.clear();
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // 🔹 Usuario local simulado
  private mockUser = {
    username: 'admin',
    password: '1234',
    role: 'ADMIN',
    token: 'local-token-123'
  };

  login(data: { username: string, password: string }): Observable<any> {
    if (data.username === this.mockUser.username && data.password === this.mockUser.password) {
      localStorage.setItem('token', this.mockUser.token);
      localStorage.setItem('username', this.mockUser.username);
      localStorage.setItem('role', this.mockUser.role);
      return of(this.mockUser);
    }
    return throwError(() => new Error('INVALID_CREDENTIALS'));
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}

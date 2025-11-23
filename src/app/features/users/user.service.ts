import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      fullName: 'Administrador General',
      email: 'admin@labs.cl',
      role: 'ADMIN',
      active: true
    },
    {
      id: 2,
      username: 'jdoe',
      fullName: 'John Doe',
      email: 'jdoe@labs.cl',
      role: 'LAB_TECH',
      active: true
    }
  ];

  private idCounter = 3;

  findAll(): Observable<User[]> {
    return of(this.users);
  }

  findById(id: number): Observable<User> {
    const found = this.users.find(u => u.id === id)!;
    return of(found);
  }

  create(user: User): Observable<User> {
    user.id = this.idCounter++;
    this.users.push(user);
    return of(user);
  }

  update(id: number, user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) this.users[index] = user;
    return of(user);
  }

  delete(id: number): Observable<void> {
    this.users = this.users.filter(u => u.id !== id);
    return of(undefined);
  }
}

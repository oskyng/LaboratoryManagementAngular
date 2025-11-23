import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from './user-form.component';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, UserFormComponent],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Usuarios</h2>
      <button class="btn btn-success" (click)="newUser()">Nuevo usuario</button>
    </div>

    <!-- LISTA -->
    <div class="table-responsive mb-3">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Activo</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td>{{ u.username }}</td>
            <td>{{ u.fullName }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>
              <span class="badge bg-success" *ngIf="u.active">Sí</span>
              <span class="badge bg-secondary" *ngIf="!u.active">No</span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-primary me-2" (click)="editUser(u)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="deleteUser(u)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FORMULARIO (CREAR / EDITAR) -->
    <app-user-form
      *ngIf="selectedUser"
      [user]="selectedUser"
      (saved)="onSaved($event)"
      (cancelled)="onCancelled()">
    </app-user-form>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];               // ← lista/colección Angular
  selectedUser: User | null = null; // ← manipulación de información con variables Angular

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll().subscribe(users => this.users = users);
  }

  newUser(): void {
    this.selectedUser = {
      username: '',
      fullName: '',
      email: '',
      role: 'LAB_TECH',
      active: true
    };
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  deleteUser(user: User): void {
    if (!confirm(`¿Eliminar usuario ${user.username}?`)) return;
    if (!user.id) return;

    this.userService.delete(user.id).subscribe(() => this.loadUsers());
  }

  onSaved(_: User): void {
    this.selectedUser = null;
    this.loadUsers();
  }

  onCancelled(): void {
    this.selectedUser = null;
  }
}

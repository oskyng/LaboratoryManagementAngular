import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
  <h2 class="mb-4">Mi Perfil</h2>

  <div class="card">
    <div class="card-body">

      <p><strong>Nombre:</strong> {{ user.fullName }}</p>
      <p><strong>Correo:</strong> {{ user.email }}</p>
      <p><strong>Rol:</strong> {{ user.role }}</p>

    </div>
  </div>
  `
})
export class ProfileComponent {
  user = this.auth.getCurrentUser();

  constructor(private auth: AuthService) {}
}

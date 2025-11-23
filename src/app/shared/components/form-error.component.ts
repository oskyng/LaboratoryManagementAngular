import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-form-error',
  imports: [CommonModule],
  template: `
    <div *ngIf="control && control.invalid && (control.dirty || control.touched)"
         class="text-danger small mt-1">
      <div *ngIf="control.errors?.['required']">Este campo es obligatorio.</div>
      <div *ngIf="control.errors?.['email']">Ingrese un correo válido.</div>
      <div *ngIf="control.errors?.['minlength']">
        Debe tener al menos {{ control.errors?.['minlength'].requiredLength }} caracteres.
      </div>
      <div *ngIf="control.errors?.['pattern']">
        Formato inválido.
      </div>
    </div>
  `
})
export class FormErrorComponent {
  @Input() control!: AbstractControl | null;
}

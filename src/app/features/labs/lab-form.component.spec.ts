import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabFormComponent } from './lab-form.component';
import { LabService } from './lab.service';
import { of, throwError } from 'rxjs';
import { Laboratory } from '../../models/laboratory.model';

describe('LabFormComponent', () => {
  let component: LabFormComponent;
  let fixture: ComponentFixture<LabFormComponent>;
  let labServiceMock: jasmine.SpyObj<LabService>;

  beforeEach(async () => {
    labServiceMock = jasmine.createSpyObj<LabService>('LabService', ['create', 'update']);

    await TestBed.configureTestingModule({
      imports: [LabFormComponent],
      providers: [
        { provide: LabService, useValue: labServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar si el formulario es inválido', () => {
    component.form.patchValue({ name: '' });
    component.onSubmit();
    expect(labServiceMock.create).not.toHaveBeenCalled();
  });

  it('debe crear laboratorio cuando no hay id', () => {
    const payload: Laboratory = { name: 'Lab A', address: '', phone: '', status: 'ACTIVO' };
    const response: Laboratory = { ...payload, id: 1 };
    labServiceMock.create.and.returnValue(of(response));

    component.form.setValue({ id: null, ...payload });

    let emitted: Laboratory | null = null;
    component.saved.subscribe(lab => (emitted = lab));

    component.onSubmit();
    expect(labServiceMock.create).toHaveBeenCalledWith(payload);
    expect(component.loading).toBeFalse();
    expect(emitted).toEqual(response);
  });

  it('debe actualizar laboratorio cuando hay id', () => {
    const payload: Laboratory = { id: 9, name: 'Lab B', address: 'X', phone: '1', status: 'INACTIVO' };
    labServiceMock.update.and.returnValue(of(payload));

    component.form.setValue(payload as any);
    let emitted: Laboratory | null = null;
    component.saved.subscribe(lab => (emitted = lab));

    component.onSubmit();
    expect(labServiceMock.update).toHaveBeenCalledWith(9, payload as any);
    expect(component.loading).toBeFalse();
    expect(emitted).toEqual(payload);
  });

  it('debe manejar error al guardar', () => {
    const payload: Laboratory = { name: 'Lab Err', address: '', phone: '', status: 'ACTIVO' };
    labServiceMock.create.and.returnValue(throwError(() => ({ status: 400 })));
    component.form.setValue({ id: null, ...payload });

    component.onSubmit();
    expect(component.loading).toBeFalse();
    expect(component.error).toContain('Error al guardar');
  });
});

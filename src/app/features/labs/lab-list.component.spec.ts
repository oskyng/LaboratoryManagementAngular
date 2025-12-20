import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LabListComponent } from './lab-list.component';
import { LabService } from './lab.service';
import { AuthService } from '../auth/auth.service';
import { of, throwError } from 'rxjs';
import { Laboratory } from '../../models/laboratory.model';

describe('LabListComponent', () => {
  let component: LabListComponent;
  let fixture: ComponentFixture<LabListComponent>;
  let labServiceMock: jasmine.SpyObj<LabService>;

  const labs: Laboratory[] = [
    { id: 1, name: 'Lab 1', address: 'A1', phone: '1', status: 'ACTIVO' },
    { id: 2, name: 'Lab 2', address: 'A2', phone: '2', status: 'INACTIVO' }
  ];

  beforeEach(async () => {
    labServiceMock = jasmine.createSpyObj<LabService>('LabService', [
      'findAll', 'delete', 'assign'
    ]);
    labServiceMock.findAll.and.returnValue(of(labs));
    const authMock = jasmine.createSpyObj<AuthService>('AuthService', ['hasAnyRole']);
    authMock.hasAnyRole.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [LabListComponent],
      providers: [
        { provide: LabService, useValue: labServiceMock },
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear y cargar laboratorios en ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(component.labs.length).toBe(2);
  });

  it('deleteLab no hace nada si no hay id', () => {
    const lab: Laboratory = { name: 'Sin Id' } as any;
    component.deleteLab(lab);
    expect(labServiceMock.delete).not.toHaveBeenCalled();
  });

  it('deleteLab debe confirmar y eliminar cuando confirma true', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    labServiceMock.delete.and.returnValue(of(void 0));
    labServiceMock.findAll.and.returnValue(of([])); // recarga

    component.deleteLab(labs[0]);
    expect(window.confirm).toHaveBeenCalled();
    expect(labServiceMock.delete).toHaveBeenCalledWith(1);
  });

  it('deleteLab no elimina cuando confirma false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteLab(labs[0]);
    expect(labServiceMock.delete).not.toHaveBeenCalled();
  });

  it('openAssign/cancelAssign deben mostrar/ocultar formulario', () => {
    expect(component.assignFormVisible).toBeFalse();
    component.openAssign(labs[0]);
    expect(component.assignFormVisible).toBeTrue();
    expect(component.currentLab?.id).toBe(1);
    component.cancelAssign();
    expect(component.assignFormVisible).toBeFalse();
    expect(component.currentLab).toBeNull();
  });

  it('assign éxito debe mostrar mensaje y resetear loading', fakeAsync(() => {
    labServiceMock.assign.and.returnValue(of({}));
    component.openAssign(labs[0]);
    component.assignmentForm.setValue({ userId: 10 });

    component.assign();
    tick();

    expect(labServiceMock.assign).toHaveBeenCalledWith({ laboratoryId: 1, userId: 10 });
    expect(component.loadingAssign).toBeFalse();
    expect(component.assignMessage).toContain('correctamente');
  }));

  it('assign error debe mostrar mensaje de error', fakeAsync(() => {
    labServiceMock.assign.and.returnValue(throwError(() => ({ status: 400 })));
    component.openAssign(labs[1]);
    component.assignmentForm.setValue({ userId: 10 });

    component.assign();
    tick();

    expect(component.loadingAssign).toBeFalse();
    expect(component.assignMessage).toContain('Error');
  }));

  it('newLab debe inicializar selectedLab', () => {
    component.newLab();
    expect(component.selectedLab).toEqual({ name: '', address: '', phone: '', status: 'ACTIVO' });
  });

  it('editLab debe copiar el lab a selectedLab', () => {
    component.editLab(labs[0]);
    expect(component.selectedLab).toEqual({ ...labs[0] });
    expect(component.selectedLab).not.toBe(labs[0]);
  });

  it('onSaved debe resetear selectedLab y recargar lista', () => {
    component.selectedLab = labs[0];
    spyOn(component, 'loadLabs');
    component.onSaved(labs[0]);
    expect(component.selectedLab).toBeNull();
    expect(component.loadLabs).toHaveBeenCalled();
  });

  it('onCancelled debe resetear selectedLab', () => {
    component.selectedLab = labs[0];
    component.onCancelled();
    expect(component.selectedLab).toBeNull();
  });

  it('assign no debe hacer nada si currentLab es null o form es inválido', () => {
    component.currentLab = null;
    component.assign();
    expect(labServiceMock.assign).not.toHaveBeenCalled();

    component.currentLab = labs[0];
    component.assignmentForm.setValue({ userId: null });
    component.assign();
    expect(labServiceMock.assign).not.toHaveBeenCalled();
  });
});

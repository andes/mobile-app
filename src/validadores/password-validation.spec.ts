import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from './password-validation'; // Ajusta la ruta si es necesario

describe('PasswordValidation', () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
        formBuilder = new FormBuilder();
        formGroup = formBuilder.group({
            password: [''],
            confirmarPassword: [''],
        });
    });

    it('devuelve null si las contraseñas coinciden', () => {
        formGroup.controls['password'].setValue('secreto123');
        formGroup.controls['confirmarPassword'].setValue('secreto123');
        const result = PasswordValidation.matchPassword(formGroup as AbstractControl);
        expect(result).toBeNull();
        expect(formGroup.controls['confirmarPassword'].errors).toBeNull();
    });

    it('define matchPassword error si las contraseñas no coinciden', () => {
        formGroup.controls['password'].setValue('secreto123');
        formGroup.controls['confirmarPassword'].setValue('diferente');
        PasswordValidation.matchPassword(formGroup as AbstractControl);
        expect(formGroup.controls['confirmarPassword'].errors).toEqual({ MatchPassword: true });
    });

    it('no define ningun error si password es vacia y confirmPassword no', () => {
        formGroup.controls['password'].setValue('');
        formGroup.controls['confirmarPassword'].setValue('algo');
        const result = PasswordValidation.matchPassword(formGroup as AbstractControl);
        expect(result).toBeNull();
        expect(formGroup.controls['confirmarPassword'].errors).toBeNull();
    });

    it('no setea error si confirmPassword es vacio y password no', () => {
        formGroup.controls['password'].setValue('algo');
        formGroup.controls['confirmarPassword'].setValue('');
        const result = PasswordValidation.matchPassword(formGroup as AbstractControl);
        expect(result).toBeNull();
        expect(formGroup.controls['confirmarPassword'].errors).toBeNull();
    });

    it('no setea error si las dos contraseñan son vacias', () => {
        formGroup.controls['password'].setValue('');
        formGroup.controls['confirmarPassword'].setValue('');
        const result = PasswordValidation.matchPassword(formGroup as AbstractControl);
        expect(result).toBeNull(); // Se consideran "vacíos" y por lo tanto coinciden (para esta validación)
        expect(formGroup.controls['confirmarPassword'].errors).toBeNull();
    });
});

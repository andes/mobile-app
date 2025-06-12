import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
    static matchPassword(AC: AbstractControl) {
        const password = AC.get('password').value; // to get value in input tag
        const confirmPassword = AC.get('confirmarPassword').value; // to get value in input tag
        if (password !== confirmPassword && password && confirmPassword) {
            AC.get('confirmarPassword').setErrors({ MatchPassword: true });
        } else {
            return null;
        }
    }
}

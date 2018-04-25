import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmarPassword').value; // to get value in input tag
        if (password !== confirmPassword && password && confirmPassword) {
            AC.get('confirmarPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }
}

import { Component } from '@angular/core';

@Component({
    selector: 'app-numeros-utiles',
    templateUrl: 'numeros-utiles.html'
})
export class NumerosUtilesPage {

    constructor() {
    }

    call(phone) {
        window.open('tel:' + phone);
    }
}

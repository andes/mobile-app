import { Component } from '@angular/core';

@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage {

    loading: any;
    modelo: any = {};
    info: any;
    public textoLibre: string = null;

    openMap(direccion) {
        window.open('geo:?q=' + direccion);
    }

}

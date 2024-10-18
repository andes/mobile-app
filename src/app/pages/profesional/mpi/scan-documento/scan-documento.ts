import { Component } from '@angular/core';
import { BarcodeScannerService } from 'src/providers/library-services/barcode-scanner.service';

@Component({
    selector: 'app-scan-documento',
    templateUrl: 'scan-documento.html',
})
export class ScanDocumentoPage {

    loading: any;
    modelo: any = {};
    info: any;

    public textoLibre: string = null;

    constructor(
        private barcodeScannerService: BarcodeScannerService) {
    }

    scanner() {
        this.barcodeScannerService.scannerProfesional();
    }
}

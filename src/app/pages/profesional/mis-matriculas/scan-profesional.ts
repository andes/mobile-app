import { Component } from '@angular/core';
import { BarcodeScannerService } from 'src/providers/library-services/barcode-scanner.service';

@Component({
    selector: 'app-scan-profesional',
    templateUrl: 'scan-profesional.html',
})
export class ScanProfesionalPage {

    loading: any;
    modelo: any = {};
    info: any;

    public textoLibre: string = null;

    constructor(private barcodeScannerService: BarcodeScannerService) {
    }

    scanner() {
        this.barcodeScannerService.scannerProfesional();
    }


}

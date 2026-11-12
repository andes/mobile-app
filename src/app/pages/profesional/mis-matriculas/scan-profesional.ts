import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
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

    constructor(
        private barcodeScannerService: BarcodeScannerService,
        private authProvider: AuthProvider
    ) {
    }

    scanner() {
        this.barcodeScannerService.scannerProfesional(this.authProvider.user?.sexo);
    }


}

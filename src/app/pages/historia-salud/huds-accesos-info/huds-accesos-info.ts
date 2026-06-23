import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/providers/storage-provider.service';

@Component({
    selector: 'app-huds-accesos-info',
    templateUrl: './huds-accesos-info.html',
    styleUrls: ['./huds-accesos-info.scss']
})
export class HudsAccesosInfoPage implements OnInit {
    familiar: any = false;

    constructor(
        private router: Router,
        private storage: StorageService
    ) {}

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
        });
    }

    continuar() {
        this.router.navigate(['historia-salud/huds-accesos-list']);
    }
}

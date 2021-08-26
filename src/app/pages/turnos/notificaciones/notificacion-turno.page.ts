import { ActivatedRoute } from '@angular/router';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-notificacion-turno',
    templateUrl: './notificacion-turno.page.html'
})

export class NotificacionTurnoPage implements OnDestroy, OnInit {
    turno: any;
    inProgress = true;

    constructor(
        private alertController: AlertController,
        private route: ActivatedRoute
    ) { }

    ngOnDestroy(): void {


    }
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.turno = JSON.parse(params.turno);
            console.log(this.turno);
            this.inProgress = false;
        });
    }


    async verInformacionTurno(datos: any) {
        const alert = await this.alertController.create({
            header: 'Turno suspendido',
            message: `
                <ion-list>
                    <ion-list-header>
                        <ion-label>
                            <b>Consulta De Medicina General</b>
                            <p>Jueves 26/08/2021, 08:00 hs.</p>
                        </ion-label>
                    </ion-list-header>
                    </ion-item>
                    <ion-item color="secondary">
                        <ion-label>
                            <h2>Equipo de Salud</h2>
                            <p>VELAZQUEZ BOC-HO, ANDRES FRANCISCO JOSE</p>
                        </ion-label>
                    </ion-item>
                    <ion-item color="secondary">
                        <ion-label>
                            <h2>Centro de Atención</h2>
                            <p>HOSPITAL PROVINCIAL NEUQUEN - DR. EDUARDO CASTRO RENDON</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
                `,
            buttons: [{
                text: 'Aceptar',
                handler: () => {
                    console.log('Confirm Okay');
                }
            }
            ]
        });

        await alert.present();
    }

}
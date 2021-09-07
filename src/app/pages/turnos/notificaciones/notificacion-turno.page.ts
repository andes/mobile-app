import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-notificacion-turno',
    templateUrl: './notificacion-turno.page.html',
    styles: [`
        h6 {
            font-size: 12px;
        }
        .telefonos h2{
            font-size: 15px;
            font-weight: bold;
        }
    `]
})

export class NotificacionTurnoPage implements OnDestroy, OnInit {
    turno: any;
    inProgress = false;
    organizacion;
    constructor(
        private alertController: AlertController,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnDestroy(): void {


    }
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.turno = JSON.parse(params.turno);
            this.organizacion = JSON.parse(params.organizacion);
            this.inProgress = false;
        });
    }


    async verInformacionTurno(turno, organizacion) {
        const alert = await this.alertController.create({
            header: 'Turno suspendido',
            message: `
                <ion-list>
                    <ion-list-header>
                        <ion-label>
                            <b>${turno.tipoPrestacion}</b>
                            <p>${turno.horaInicio}</p>
                        </ion-label>
                    </ion-list-header>
                    </ion-item>
                    <ion-item color="secondary">
                        <ion-label>
                            <h2>Equipo de Salud</h2>
                            <p>${turno.profesionales[0].apellido}, ${turno.profesionales[0].nombre}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item color="secondary">
                        <ion-label>
                            <h2>Centro de Atención</h2>
                            <p>${organizacion.nombre}</p>
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

    irATurnos() {
        this.router.navigate(['/turnos']);
    }

}

import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastProvider {

    constructor(private toastCtrl: ToastController) {
        //
    }

    async displayToast(title, type = 'success', time = 3000, callbak = null) {
        const toast = await this.toastCtrl.create({
            message: title,
            duration: time,
            position: 'bottom',
            cssClass: type
        });
        toast.present();
        const { role } = await toast.onDidDismiss();

        switch (role) {
            case 'cancel':
                console.error(`Cancelado por el usuario.`);
                break;
            case 'timeout':
                console.error(`Timeout.`);
                break;
        }
    }

    public async success(text, duration = 3000, callbak = null) {
        this.displayToast(text, 'success', duration, callbak);
    }

    public async danger(text, duration = 3000, callbak = null) {
        this.displayToast(text, 'danger', duration, callbak);
    }


}


import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastProvider {

    constructor(private toastCtrl: ToastController) {
        //
    }

    async displayToast(title, type = 'success', time = 3000) {
        const toast = await this.toastCtrl.create({
            message: title,
            duration: time,
            position: 'bottom',
            color: type
        });
        toast.present();
        const { role } = await toast.onDidDismiss();

        switch (role) {
            case 'cancel':
                console.error('Cancelado por el usuario.');
                break;
            case 'timeout':
                console.error('Timeout.');
                break;
        }
    }

    public async success(text, duration = 3000) {
        this.displayToast(text, 'success', duration);
    }

    public async danger(text, duration = 3000) {
        this.displayToast(text, 'danger', duration);
    }


}


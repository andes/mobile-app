import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class ToastProvider {

  constructor(private toastCtrl: ToastController) {
    //
  }

  displayToast(title, type = 'success', time = 3000, callbak = null) {
    let toast = this.toastCtrl.create({
      message: title,
      duration: time,
      position: 'bottom',
      cssClass: type
    });

    toast.onDidDismiss(() => {
      if (callbak) {
        callbak();
      }
    });

    toast.present();
  }

  public success(text, duration = 3000, callbak = null) {
    this.displayToast(text, 'success', duration, callbak)
  }

  public danger(text, duration = 3000, callbak = null) {
    this.displayToast(text, 'danger', duration, callbak)
  }


}


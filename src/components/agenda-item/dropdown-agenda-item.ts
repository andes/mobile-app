import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
    template: `
    <ion-list class="turno-item-popover">
      <!--<ion-list-header>Menu</ion-list-header>-->
      <button ion-item (click)="close('confirmar')" class="confirmar-item"> <ion-icon name="checkmark"></ion-icon> Confirmar asistencia </button>
      <button ion-item (click)="close('cancelar')" class="cancelar-item"> <ion-icon name="remove-circle"> </ion-icon> Informar suspensión </button>
    </ion-list>
  `
})
export class DropdownAgendaItemComponent {
    private callback: any;

    constructor(private modalCtrl: ModalController, private params: NavParams) {
        this.callback = this.params.get('callback');
    }

    close(action) {
        this.modalCtrl.dismiss();
        this.callback(action);
    }
}

import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
    template: `
    <ion-list class="turno-item-popover">
      <!--<ion-list-header>Menu</ion-list-header>-->
      <button ion-item (click)="close('asistencia')" *ngIf="showConfirmAsistencia" class="asistencia-item"> <ion-icon name="checkmark"></ion-icon> Dar asistencia a turno </button>
      <button ion-item (click)="close('confirmar')" *ngIf="showConfirm" class="confirmar-item"> <ion-icon name="checkmark"></ion-icon> Confirmar turno </button>
      <button ion-item (click)="close('cancelar')" class="cancelar-item"> <ion-icon name="remove-circle"> </ion-icon> Cancelar turno </button>
    </ion-list>
  `
})
export class DropdownTurnoItemComponent {
    private callback: any;
    private showConfirm: boolean;
    private showConfirmAsistencia: boolean;

    constructor(private modalCtrl: ModalController, private params: NavParams) {
        this.callback = this.params.get('callback');
        this.showConfirm = this.params.get('showConfirm');
        this.showConfirmAsistencia = this.params.get('showConfirmAsistencia');
    }

    close(action) {
        this.modalCtrl.dismiss();
        this.callback(action);
    }
}

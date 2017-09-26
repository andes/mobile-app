import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ViewController } from 'ionic-angular';

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
export class DropdownTurnoItem {
  private callback: any;
  private showConfirm: Boolean;
  private showConfirmAsistencia: Boolean;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.callback = this.params.get('callback');
    this.showConfirm = this.params.get('showConfirm');
    this.showConfirmAsistencia = this.params.get('showConfirmAsistencia');
  }

  close(action) {
    this.viewCtrl.dismiss();
    this.callback(action);
  }
}

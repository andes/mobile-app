import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ViewController } from 'ionic-angular';

@Component({
  template: `
    <ion-list class="turno-item-popover">
      <!--<ion-list-header>Menu</ion-list-header>-->
      <button ion-item (click)="close('confirmar')" class="confirmar-item"> <ion-icon name="checkmark"></ion-icon> Confirmar asistencia </button>
      <button ion-item (click)="close('cancelar')" class="cancelar-item"> <ion-icon name="remove-circle"> </ion-icon> Informar suspensión </button>
    </ion-list>
  `
})
export class DropdownAgendaItem {
  private callback: any;
  private reasignado: Boolean;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.callback = this.params.get('callback');
  }

  close(action) {
    this.viewCtrl.dismiss();
    this.callback(action);
  }
}

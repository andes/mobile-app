import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ViewController } from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <!--<ion-list-header>Menu</ion-list-header>-->
      <button ion-item (click)="close('cancelar')">Cancelar</button>
      <button ion-item (click)="close('confirmar')" *ngIf="reasignado">Confirmar</button>
    </ion-list>
  `
})
export class DropdownTurnoItem {
  private callback: any;
  private reasignado: Boolean;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.callback = this.params.get('callback');
    this.reasignado = this.params.get('reasignado');
  }

  close(action) {
    this.viewCtrl.dismiss();
    this.callback(action);
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-navbar',
  templateUrl: 'navbar.html',
})
export class NavbarPage {
  @Input() mostrarMenu: boolean;

  ionViewDidLoad() {
    //
  }

  constructor() {

  }
}

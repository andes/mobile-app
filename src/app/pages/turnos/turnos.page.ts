import { Component, OnDestroy } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { TurnosProvider } from 'src/providers/turnos';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.page.html',
  styleUrls: ['./turnos.page.scss'],
})
export class TurnosPage implements OnDestroy {
  familiar: any = false;
  turnos: any[] = null;
  habilitarTurnos = false;
  private onResumeSubscription: Subscription;

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
  constructor(
    public menuCtrl: MenuController,
    public platform: Platform,
    public storage: Storage,
    public turnosProvider: TurnosProvider,
    private router: Router
  ) {
    this.menuCtrl.enable(true, 'historial');
    this.storage.get('familiar').then((value) => {
      if (value) {
        this.familiar = value;
      }
      // this.getTurnos();
      this.onResumeSubscription = platform.resume.subscribe(() => {
        this.getTurnos();
      });
      this.getTurnos();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'historial');
  }

  getTurnos() {
    const params = { horaInicio: moment(new Date()).format(), familiar: JSON.stringify(this.familiar) };
    this.turnosProvider.get(params).subscribe((data: any[]) => {
      this.turnos = data;
      this.habilitarTurnos = true;
    });
  }

  onCancelTurno($event) {
    this.turnos = this.turnos.filter(item => item._id !== $event._id);
  }

  onClickEvent($event) {
    this.router.navigate(['/turnos/detalle'], { queryParams: { turno: JSON.stringify($event) } });
  }

  buscarPrestacion() {
    this.router.navigate(['/turnos/prestaciones'], { queryParams: { turnos: JSON.stringify(this.turnos) } });
  }

  abrirHistorial() {
    this.router.navigate(['/turnos/historial']);
    // this.navCtrl.push(HistorialTurnosPage);
  }
}

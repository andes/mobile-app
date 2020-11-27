import { AuthProvider } from './../../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage'

import { VacunasProvider } from '../../../providers/vacunas/vacunas';
import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';

@Component({
  selector: 'app-vacunas',
  templateUrl: './vacunas.page.html',
  styleUrls: ['./vacunas.page.scss'],
})
export class VacunasPage {
  vacunas: any[] = null;

  constructor(
      public storage: Storage,
      public vacunasProvider: VacunasProvider,
      public navCtrl: NavController,
      public navParams: NavParams,
      public authProvider: AuthProvider,
      private toastCtrl: ToastProvider,
      public reporter: ErrorReporterProvider) {

      this.getVacunas();
  }

  ionViewDidLoad() {
      this.reporter.alert();
  }

  onBugReport() {
      this.reporter.report();
  }

  getVacunas() {

      const params = { dni: this.authProvider.user.documento };

      this.vacunasProvider.getCount(params).then(cantidad => {
          this.storage.get('cantidadVacunasLocal').then((cantidadVacunasLocal) => {

              // buscamos si hay vacunas almacenadas
              this.storage.get('vacunas').then((vacunasLocal) => {

                  if (!vacunasLocal || cantidadVacunasLocal !== cantidad) {
                      if (!cantidadVacunasLocal || cantidadVacunasLocal !== cantidad) {
                          // almacenamos la cantidad de vacunas en el telefono
                          this.storage.set('cantidadVacunasLocal', cantidad);
                      }

                      this.vacunasProvider.get(params).then((data: any[]) => {
                          this.vacunas = data;
                          this.storage.set('vacunas', data);
                      }).catch(() => {
                          this.vacunas = [];
                      });

                  } else {
                      this.vacunas = vacunasLocal;
                  }
              }).catch(() => {
                  this.vacunas = [];
              });
          });

      });
  }
}

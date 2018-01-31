import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

// pages
import { LoginPage } from '../login/login';
import { NumerosUtilesPage } from '../datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../datos-utiles/feed-noticias/feed-noticias';
import { CentrosSaludPage } from "../datos-utiles/centros-salud/centros-salud";
import { TurnosPage } from "../turnos/turnos";
import { AgendasPage } from "../profesional/agendas/agendas";
import { VacunasPage } from "../vacunas/vacunas";
import { FaqPage } from '../datos-utiles/faq/faq';
import { HistoriaDeSaludPage } from '../historia-salud/historia-salud';
import { DeviceProvider } from '../../providers/auth/device';
import { RupAdjuntarPage } from '../../pages/profesional/rup-adjuntar/rup-adjuntar';
import { RupConsultorioPage } from '../profesional/consultorio/rup-consultorio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mostrarMenu: boolean = true;
  user: any;
  constructor(
    public authService: AuthProvider,
    public deviceService: DeviceProvider,
    public navCtrl: NavController) {

    this.user = this.authService.user;
  }

  ionViewDidLoad() {
  }

  isLogin() {
    return this.user != null;
  }

  isPaciente() {
    return this.user && this.user.profesionalId == null;
  }

  isProfesional() {
    return this.user && this.user.profesionalId != null;
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  numerosUtiles() {
    this.navCtrl.push(NumerosUtilesPage);
  }

  vacunas() {
    this.navCtrl.push(VacunasPage);
  }

  farmacias() {
    this.navCtrl.push(FarmaciasTurnoPage);
  }

  noticias() {
    this.navCtrl.push(FeedNoticiasPage);
  }

  misTurnos() {
    this.navCtrl.push(TurnosPage);
  }

  misAgendas() {
    // this.navCtrl.push(RupAdjuntarPage,  { id: '5a019fa1fbd6cc31f642484e' }  );
    this.navCtrl.push(AgendasPage);
  }

  consultorio() {
    this.navCtrl.push(RupConsultorioPage);
  }

  centrosDeSalud() {
    this.navCtrl.push(CentrosSaludPage);
  }

  faq() {
    this.navCtrl.push(FaqPage);
  }

  historiaDeSalud() {
    this.navCtrl.push(HistoriaDeSaludPage);
  }


}

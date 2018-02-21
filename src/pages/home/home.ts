import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { PacienteProvider } from '../../providers/paciente';

// pages
import { LoginPage } from '../login/login';
import { NumerosUtilesPage } from '../datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../datos-utiles/feed-noticias/feed-noticias';
import { CentrosSaludPage } from "../datos-utiles/centros-salud/centros-salud";
import { TurnosPage } from "../turnos/turnos";
import { AgendasPage } from "../profesional/agendas/agendas";
import { VacunasPage } from "../vacunas/vacunas";
import { LaboratoriosPage } from "../laboratorios/laboratorios";
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
//   mostrarMenu: boolean = true;
    started = false;
  user: any;
  constructor(
    public authService: AuthProvider,
    public deviceService: DeviceProvider,
    public navCtrl: NavController) {

    this.user = this.authService.user;
  }

  mostrarMenu () {
      return !!this.authService.user;
  }

  ionViewDidLoad() {
      setTimeout(() => {
          this.started = true;

      }, 50);
  }

  isLogin() {
    return this.authService.user != null;
  }

  isPaciente() {
    return this.authService.user && this.authService.user.profesionalId == null;
  }

  isProfesional() {
    return this.authService.user && this.authService.user.profesionalId != null;
  }

  login() {
      if (!this.isLogin()) {
          this.navCtrl.push(LoginPage);
      }
  }

  numerosUtiles() {
    this.navCtrl.push(NumerosUtilesPage);
  }

  vacunas() {
    this.navCtrl.push(VacunasPage);
  }

  laboratorio() {
    this.navCtrl.push(LaboratoriosPage);
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

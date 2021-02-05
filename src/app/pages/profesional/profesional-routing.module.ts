import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaDetallePage } from './agendas/agenda-detalle/agenda-detalle';
import { AgendasPage } from './agendas/agendas';
import { RupConsultorioPage } from './consultorio/rup-consultorio';
import { FormTerapeuticoPage } from './form-terapeutico/form-terapeutico';
import { FormTerapeuticoDetallePage } from './form-terapeutico/form-terapeutico-detalle';
import { FormTerapeuticoArbolPage } from './form-terapeutico/form-terapeutico-arbol';
import { RegistroPacientePage } from './mpi/registro-paciente/registro-paciente';
import { ScanDocumentoPage } from './mpi/scan-documento/scan-documento';

import { ProfesionalPage } from './profesional.page';
import { ProfileProfesionalComponent } from './profile/profile-profesional';
import { RupAdjuntarPage } from './rup-adjuntar/rup-adjuntar';

const routes: Routes = [
  {
    path: '',
    component: ProfesionalPage
  },
  {
    path: 'consultorio',
    component: RupConsultorioPage
  },
  {
    path: 'adjuntar',
    component: RupAdjuntarPage
  },
  {
    path: 'agendas',
    component: AgendasPage
  },
  {
    path: 'agenda-detalle',
    component: AgendaDetallePage
  },
  {
    path: 'mpi',
    component: ScanDocumentoPage
  },
  {
    path: 'registro-paciente',
    component: RegistroPacientePage
  },
  {
    path: 'formulario-terapeutico',
    component: FormTerapeuticoPage,
  },
  {
    path: 'formulario-terapeutico/detalle',
    component: FormTerapeuticoDetallePage
  },
  {
    path: 'formulario-terapeutico/arbol',
    component: FormTerapeuticoArbolPage
  },
  {
    path: 'profile',
    component: ProfileProfesionalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesionalPageRoutingModule { }

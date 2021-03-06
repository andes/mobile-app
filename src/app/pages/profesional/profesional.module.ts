import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfesionalPageRoutingModule } from './profesional-routing.module';

import { ProfesionalPage } from './profesional.page';
import { RupConsultorioPage } from './consultorio/rup-consultorio';
import { RupAdjuntarPage } from './rup-adjuntar/rup-adjuntar';
import { Camera } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { AgendasPage } from './agendas/agendas';
import { AgendaDetallePage } from './agendas/agenda-detalle/agenda-detalle';
import { AgendaItemComponent } from 'src/components/agenda-item/agenda-item';
import { ScanParser } from 'src/providers/scan-parser';
import { FtpProvider } from 'src/providers/ftp';
import { EspecialidadesFTProvider } from 'src/providers/especialidadesFT';
import { FormTerapeuticoPage } from './form-terapeutico/form-terapeutico';
import { FormTerapeuticoDetallePage } from './form-terapeutico/form-terapeutico-detalle';
import { FormTerapeuticoArbolPage } from './form-terapeutico/form-terapeutico-arbol';
import { ArbolItemPage } from './form-terapeutico/arbolItem';
import { PacienteMPIService } from 'src/providers/paciente-mpi';
import { ScanDocumentoPage } from './mpi/scan-documento/scan-documento';
import { RegistroPacientePage } from './mpi/registro-paciente/registro-paciente';
import { ProfileProfesionalComponent } from './profile/profile-profesional';
import { AdsModule } from 'src/app/ads/ads.module';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfesionalPageRoutingModule,
        AdsModule,
        IonicStorageModule.forRoot(),
    ],
    declarations: [
        ProfesionalPage,
        RupAdjuntarPage,
        RupConsultorioPage,
        AgendasPage,
        AgendaDetallePage,
        AgendaItemComponent,
        FormTerapeuticoPage,
        FormTerapeuticoDetallePage,
        FormTerapeuticoArbolPage,
        ArbolItemPage,
        ScanDocumentoPage,
        RegistroPacientePage,
        ProfileProfesionalComponent,
    ],
    providers: [
        Camera,
        Base64,
        ScanParser,
        FtpProvider,
        EspecialidadesFTProvider,
        PacienteMPIService,
        IonicStorageModule
    ],

})
export class ProfesionalPageModule { }

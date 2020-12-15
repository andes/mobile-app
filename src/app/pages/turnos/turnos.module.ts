import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { TurnosPageRoutingModule } from './turnos-routing.module';

import { TurnosPage } from './turnos.page';
import { TurnosProvider } from 'src/providers/turnos';
import { TurnosPrestacionesPage } from './prestaciones/turnos-prestaciones';
import { TurnosBuscarPage } from './buscar/turnos-buscar';
import { TurnosCalendarioPage } from './calendario/turnos-calendario';
import { TurnoItemComponent } from 'src/components/turno-item/turno-item';
import { TurnosDetallePage } from './detalles/turno-detalle';
import { HistorialTurnosPage } from './historial/historial-turnos';
import { TextFilterPipe } from 'src/pipes/textFilter.pipe';
import { EnumerarPipe } from 'src/pipes/enumerar.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurnosPageRoutingModule
  ],
  declarations: [
    TurnosPage,
    TurnosPrestacionesPage,
    TurnosBuscarPage,
    TurnosCalendarioPage,
    TurnoItemComponent,
    TurnosDetallePage,
    HistorialTurnosPage,
    TextFilterPipe,
    EnumerarPipe
  ],
  providers: [TurnosProvider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TurnosPageModule { }

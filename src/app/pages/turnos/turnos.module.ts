import { NgModule } from '@angular/core';
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
// import { TextFilterPipe } from 'src/pipes/textFilter.pipe';
import { EnumerarPipe } from 'src/pipes/enumerar.pipe';
import { AdsModule } from 'src/app/ads/ads.module';
import { MapTurnosPage } from './mapa/mapa';
import { AgmCoreModule } from '@agm/core';
import { ENV } from '@app/env';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AdsModule,
        TurnosPageRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: ENV.MAP_KEY
        })
    ],
    declarations: [
        TurnosPage,
        TurnosPrestacionesPage,
        TurnosBuscarPage,
        TurnosCalendarioPage,
        TurnoItemComponent,
        TurnosDetallePage,
        HistorialTurnosPage,
        MapTurnosPage,
        // TextFilterPipe,
        EnumerarPipe
    ],
    providers: [TurnosProvider],

})
export class TurnosPageModule { }

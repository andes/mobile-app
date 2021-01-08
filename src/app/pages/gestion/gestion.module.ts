import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionPageRoutingModule } from './gestion-routing.module';
import { GestionPage } from './gestion.page';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { MapaDetalleComponent } from './mapa-detalle/mapa-detalle';
import { AccionesComponent } from './acciones/acciones';
import { ListadoAreasComponent } from './listado/listado';
import { ListadoDetalleComponent } from './listado-detalle/listado-detalle';
import { DetalleEfectorComponent } from './detalle-efector/detalle-efector';
import { MonitoreoComponent } from './monitoreo/monitoreo';
import { AdsModule } from 'src/app/ads/ads.module';
import { PopoverPage } from './popover/popover.page';
import { NuevaMinutaComponent } from './monitoreo/minutas/nuevaMinuta';
import { Camera } from '@ionic-native/camera/ngx';
import { ListadoMinutasComponent } from './monitoreo/minutas/listadoMinutas';
import { MinutasProvider } from 'src/providers/minutas.provider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GestionPageRoutingModule,
    AdsModule
  ],
  declarations: [
    GestionPage,
    MapaDetalleComponent,
    AccionesComponent,
    ListadoAreasComponent,
    ListadoDetalleComponent,
    DetalleEfectorComponent,
    MonitoreoComponent,
    NuevaMinutaComponent,
    ListadoMinutasComponent,
    PopoverPage
  ],
  providers: [
    PagesGestionProvider,
    MinutasProvider,
    Camera
  ],

})
export class GestionPageModule { }

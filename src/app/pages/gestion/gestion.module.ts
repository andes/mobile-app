import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPageRoutingModule } from './gestion-routing.module';

import { GestionPage } from './gestion.page';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { MapaDetalleComponent } from './mapa-detalle/mapa-detalle';
import { AccionesComponent } from './acciones/acciones';
import { ListadoComponent } from './listado/listado';
import { ListadoDetalleComponent } from './listado-detalle/listado-detalle';
import { DetalleEfectorComponent } from './detalle-efector/detalle-efector';
import { MonitoreoComponent } from './monitoreo/monitoreo';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionPageRoutingModule
  ],
  declarations: [
    GestionPage,
    MapaDetalleComponent,
    AccionesComponent,
    ListadoComponent,
    ListadoDetalleComponent,
    DetalleEfectorComponent,
    MonitoreoComponent
  ],
  providers: [
    PagesGestionProvider
  ],

})
export class GestionPageModule { }

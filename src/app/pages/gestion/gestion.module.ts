import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionPageRoutingModule } from './gestion-routing.module';

import { GestionPage } from './gestion.page';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { MapaDetalleComponent } from './mapa-detalle/mapaDetalle';
import { AccionesComponent } from './acciones/acciones';

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
    AccionesComponent
  ],
  providers: [
    PagesGestionProvider
  ]
})
export class GestionPageModule {}

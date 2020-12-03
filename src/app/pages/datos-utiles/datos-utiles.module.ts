import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosUtilesPageRoutingModule } from './datos-utiles-routing.module';

import { DatosUtilesPage } from './datos-utiles.page';
import { FarmaciasTurnoPage } from './farmacias-turno/farmacias-turno';
import { CampaniasProvider } from 'src/providers/campanias';
import { CampaniasListPage } from './campanias/campanias-list';
import { NoticiasProvider } from 'src/providers/noticias';
import { PuntoSaludablePage } from './punto-saludable/punto-saludable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosUtilesPageRoutingModule
  ],
  declarations: [
    DatosUtilesPage,
    FarmaciasTurnoPage,
    CampaniasListPage,
    PuntoSaludablePage
  ],
  providers: [
    CampaniasProvider,
    NoticiasProvider
  ]
})
export class DatosUtilesPageModule { }

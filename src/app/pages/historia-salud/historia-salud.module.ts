import { AuthProvider } from 'src/providers/auth/auth';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoriaSaludPageRoutingModule } from './historia-salud-routing.module';

import { HistoriaSaludPage } from './historia-salud.page';
import { CategoriasProvider } from 'src/providers/historia-salud/categorias';
import { DetalleCategoriaPage } from './categorias/detalle-categoria';
import { AccesosMiHUDSPage } from './accesos-mi-huds/accesos-mi-huds';
import { DetalleAccesoMiHUDSPage } from './accesos-mi-huds/detalle-acceso-mi-huds';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoriaSaludPageRoutingModule
  ],
  declarations: [
    HistoriaSaludPage,
    DetalleCategoriaPage,
    AccesosMiHUDSPage,
    DetalleAccesoMiHUDSPage,
  ],
  providers: [
    CategoriasProvider,
  ]
})
export class HistoriaSaludPageModule { }

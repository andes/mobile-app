import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsModule } from 'src/app/ads/ads.module';

import { IonicModule } from '@ionic/angular';

import { HistoriaSaludPageRoutingModule } from './historia-salud-routing.module';

import { HistoriaSaludPage } from './historia-salud.page';
import { CategoriasProvider } from 'src/providers/historia-salud/categorias';
import { RecetasProvider } from 'src/providers/historia-salud/recetas';
import { DetalleCategoriaPage } from './categorias/detalle-categoria';
import { RecetasPage } from './recetas/recetas';
import { DetalleRecetaPage } from './recetas/detalle-receta/detalle-receta';
@NgModule({
    imports: [
        AdsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HistoriaSaludPageRoutingModule,
    ],
    declarations: [
        HistoriaSaludPage,
        DetalleCategoriaPage,
        RecetasPage,
        DetalleRecetaPage,
    ],
    providers: [CategoriasProvider, RecetasProvider],
})
export class HistoriaSaludPageModule {}

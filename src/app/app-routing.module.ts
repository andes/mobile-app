import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'turnos',
    loadChildren: () => import('./pages/turnos/turnos.module').then(m => m.TurnosPageModule)
  },
  {
    path: 'datos-utiles',
    loadChildren: () => import('./pages/datos-utiles/datos-utiles.module').then(m => m.DatosUtilesPageModule)
  },
  {
    path: 'vacunas',
    loadChildren: () => import('./pages/vacunas/vacunas.module').then(m => m.VacunasPageModule)
  },
  {
    path: 'laboratorios',
    loadChildren: () => import('./pages/laboratorios/laboratorios.module').then(m => m.LaboratoriosPageModule)
  },
  {
    path: 'mis-familiares',
    loadChildren: () => import('./pages/mis-familiares/mis-familiares.module').then(m => m.MisFamiliaresPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'profesional',
    loadChildren: () => import('./pages/profesional/profesional.module').then(m => m.ProfesionalPageModule)
  },
  {
    path: 'historia-salud',
    loadChildren: () => import('./pages/historia-salud/historia-salud.module').then(m => m.HistoriaSaludPageModule)
  },
  {
    path: 'gestion',
    loadChildren: () => import('./pages/gestion/gestion.module').then(m => m.GestionPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  }
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

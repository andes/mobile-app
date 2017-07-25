import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditorPacientePage } from './editor-paciente';

@NgModule({
  declarations: [
    EditorPacientePage,
  ],
  imports: [
    IonicPageModule.forChild(EditorPacientePage),
  ],
  exports: [
    EditorPacientePage
  ]
})
export class EditorPacientePageModule { }

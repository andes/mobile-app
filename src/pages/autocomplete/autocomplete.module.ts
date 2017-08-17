import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutocompletePage } from './autocomplete';

@NgModule({
  declarations: [
    AutocompletePage,
  ],
  imports: [
    IonicPageModule.forChild(AutocompletePage),
  ],
  exports: [
    AutocompletePage
  ]
})
export class AutocompletePageModule {}

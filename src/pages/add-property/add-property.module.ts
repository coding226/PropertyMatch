import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPropertyPage } from './add-property';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { ShareModule } from '../../shared/ShareModule';



@NgModule({
  declarations: [
    AddPropertyPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(AddPropertyPage),
    GooglePlacesAutocompleteComponentModule
  ], exports: [AddPropertyPage]
})
export class AddPropertyPageModule { }

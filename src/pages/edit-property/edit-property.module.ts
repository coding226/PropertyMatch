import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPropertyPage } from './edit-property';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
	declarations: [
		EditPropertyPage,
	],
	imports: [
		ShareModule,
		IonicPageModule.forChild(EditPropertyPage),
		GooglePlacesAutocompleteComponentModule
	],
	exports: [EditPropertyPage]
})
export class EditPropertyPageModule { }

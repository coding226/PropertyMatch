import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { ProfilePage } from './profile';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
	declarations: [
		ProfilePage,
	],
	imports: [
		ShareModule,
		IonicPageModule.forChild(ProfilePage),
		GooglePlacesAutocompleteComponentModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
})
export class ProfilePageModule { }

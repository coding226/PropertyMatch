import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PropertyDetailPage } from './property-detail';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
	declarations: [
		PropertyDetailPage,
	],
	imports: [
		ShareModule,
		IonicPageModule.forChild(PropertyDetailPage),
	], exports: [PropertyDetailPage]
})
export class PropertyDetailPageModule { }

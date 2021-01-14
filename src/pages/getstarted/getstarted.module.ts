import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetstartedPage } from './getstarted';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    GetstartedPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(GetstartedPage),
  ], exports: [GetstartedPage]
})
export class GetstartedPageModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhonenumberPage } from './phonenumber';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    PhonenumberPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(PhonenumberPage),
  ],
})
export class PhonenumberPageModule { }

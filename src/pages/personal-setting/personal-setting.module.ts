import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalSettingPage } from './personal-setting';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    PersonalSettingPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(PersonalSettingPage),
  ],
})
export class PersonalSettingPageModule { }

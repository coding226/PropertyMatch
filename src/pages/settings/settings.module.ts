import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(SettingsPage),
  ],
})
export class SettingsPageModule { }

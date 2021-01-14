import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationSettingsPage } from './notification-settings';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    NotificationSettingsPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(NotificationSettingsPage),
  ],
})
export class NotificationSettingsPageModule { }

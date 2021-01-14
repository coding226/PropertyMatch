import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgCalendarModule } from 'ionic2-calendar';

import { AddAppointmentPage } from './add-appointment';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    AddAppointmentPage,
  ],
  imports: [
    ShareModule,
    NgCalendarModule,
    IonicPageModule.forChild(AddAppointmentPage),
  ],
})
export class AddAppointmentPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgetPasswordPage } from './forget-password';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    ForgetPasswordPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(ForgetPasswordPage),
  ],
})
export class ForgetPasswordPageModule { }

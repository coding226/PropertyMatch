import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyNumberResetPasswordPage } from './verify-number-reset-password';

import { PipesModule } from '../../pipes/pipes.module';
import { ShareModule } from '../../shared/ShareModule';
@NgModule({
  declarations: [
    VerifyNumberResetPasswordPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(VerifyNumberResetPasswordPage),
    PipesModule
  ],
})
export class VerifyNumberResetPasswordPageModule { }

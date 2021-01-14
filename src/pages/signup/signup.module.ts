import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(SignupPage),
  ], exports: [SignupPage]
})
export class SignupPageModule { }

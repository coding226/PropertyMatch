import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(LoginPage),
  ], exports: [LoginPage]
})
export class LoginPageModule { }

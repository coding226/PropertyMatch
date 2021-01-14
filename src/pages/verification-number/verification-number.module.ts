import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificationNumberPage } from './verification-number';
import { PipesModule } from '../../pipes/pipes.module';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    VerificationNumberPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(VerificationNumberPage),
    PipesModule
  ], exports: [VerificationNumberPage]
})
export class VerificationNumberPageModule { }

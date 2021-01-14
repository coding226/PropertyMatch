import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareModule } from '../../shared/ShareModule';
import { ChooseLanguagePage } from './choose-language';

@NgModule({
  declarations: [
    ChooseLanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseLanguagePage),
    ShareModule,
  ],
  exports: [ChooseLanguagePage]
})
export class ChooseLanguageModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tabs2Page } from './tabs2';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    Tabs2Page,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(Tabs2Page),
  ], exports: [Tabs2Page]
})
export class Tabs2PageModule { }

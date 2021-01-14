import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeekerHomePage } from './seeker-home';
import { SwingModule } from 'angular2-swing';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    SeekerHomePage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(SeekerHomePage), SwingModule
  ], exports: [SeekerHomePage]
})
export class SeekerHomePageModule { }

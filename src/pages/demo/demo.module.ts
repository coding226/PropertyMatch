import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DemoPage } from './demo';
import { SwingModule } from 'angular2-swing';
import { HttpModule } from '@angular/http';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    DemoPage,
  ],
  imports: [
    IonicPageModule.forChild(DemoPage),SwingModule,
    HttpModule,
    ShareModule,
  ],exports:[DemoPage]
})
export class DeomoModule {}

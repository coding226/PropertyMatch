import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(MessagesPage),
  ], exports: [MessagesPage]
})
export class MessagesPageModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatViewPage } from './chat-view';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    ChatViewPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(ChatViewPage),
  ],exports:[ChatViewPage]
})
export class ChatViewPageModule {}

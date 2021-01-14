import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    EditProfilePage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(EditProfilePage),
  ], exports: [EditProfilePage]
})
export class EditProfilePageModule { }

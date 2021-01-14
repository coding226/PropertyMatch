import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritePropertiesPage } from './favorite-properties';
import { ShareModule } from '../../shared/ShareModule';

@NgModule({
  declarations: [
    FavoritePropertiesPage,
  ],
  imports: [
    ShareModule,
    IonicPageModule.forChild(FavoritePropertiesPage),
  ],
})
export class FavoritePropertiesPageModule {}

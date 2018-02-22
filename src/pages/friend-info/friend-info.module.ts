import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendInfoPage } from './friend-info';

@NgModule({
  declarations: [
    FriendInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendInfoPage),
  ],
})
export class FriendInfoPageModule {}

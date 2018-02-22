import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/authService.provider';
/**
 * Generated class for the FriendInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-info',
  templateUrl: 'friend-info.html',
})
export class FriendInfoPage {
  personalInfo:any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private service: AuthService) {
  	this.personalInfo = this.navParams.data;
  }

  toggleSelection(friendRef, toggle)
    {
        this.service.determineMyLocationShareOrNot(friendRef, toggle)
        .then(data => {
        })
        .catch(error => {
        });

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendInfoPage');
  }

}

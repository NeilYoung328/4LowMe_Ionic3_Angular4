import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { AuthService } from '../../providers/authService.provider';

/**
 * Generated class for the ScreenshotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-screenshot',
    templateUrl: 'screenshot.html',
})
export class ScreenshotPage {
    loading: Loading;
    personalInfo: any;
    requestRef:any;
    imageData:string;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public platform   : Platform,
        private loadingCtrl: LoadingController,
        private socialSharing: SocialSharing,
        private service: AuthService ) {

        this.personalInfo = this.navParams.data;
        this.requestRef = this.personalInfo.FollowRequest_Ref;
    }

    getSessionImage(requestRef) {
        this.showLoading();
        this.service.getSessionImage(requestRef)
        .then(data=>{
            this.loading.dismiss();
            this.imageData = data[data.length-1].Image;
        }).catch(error=>{});
    }


    facebookShare(){
        console.log("facebook Share...");
    this.socialSharing.shareViaFacebook("I'd like to share session screenshot.", this.imageData, "http://masteringionic2.com/products/product-detail/s/mastering-ionic-2-e-book"); 
    }

    twitterShare(){
        console.log("twitter Share...");
    this.socialSharing.shareViaTwitter("I'd like to share session screenshot.", this.imageData, "http://masteringionic2.com/products/product-detail/s/mastering-ionic-2-e-book"); 
    }

    ionViewWillEnter() {
        this.getSessionImage(this.requestRef);
    }
    
    gotohome() {
    	this.navCtrl.push('FriendListPage');
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner:'bubbles'
        });
        this.loading.present();
    }
   

}

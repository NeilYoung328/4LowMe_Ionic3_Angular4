import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/authService.provider';
/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-resetpassword',
    templateUrl: 'resetpassword.html',
})

export class ResetpasswordPage {
    resetpassInfo = {email :''};
    loading: Loading;
    constructor(
        private nav: NavController, 
        private service: AuthService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController) {

    }
      
    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }
    /*
        show alert
        @parameter
            title: string -> alert title
            content: string -> alert content
    */
    showAlert(title, content) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: ['OK']
        });
        alert.present();
    }
    resetPass()
    {
        this.showLoading();
        this.service.resetPassword(this.resetpassInfo.email).then(data => {
            if(data == '1'){
                this.showAlert('success', 'success');
                this.nav.push('LoginPage');
            } else {
                this.showAlert('failed', 'please try again.');
            }
        })
    }


}

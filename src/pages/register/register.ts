import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController} from 'ionic-angular';

import { AuthService } from '../../providers/authService.provider';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  	selector: 'page-register',
  	templateUrl: 'register.html',
})
export class RegisterPage {
    loading: Loading;
	createSuccess = false;
  	registerCredentials = {firstName:'', lastName:'', email: '', password: '',Repassword:''};

    constructor(
    	private navCtrl: NavController, 
        private loadingCtrl: LoadingController,
        private service: AuthService,
        private alertCtrl: AlertController) {
    }

    register() {
        if(this.registerCredentials.password != this.registerCredentials.Repassword)
        {
      	    this.showError('Passwords must be same.');
        }
        else
        {
            this.showLoading();
            this.service.signup1(this.registerCredentials,'E').then(data => {
                if(data.LoginResponds == '1' )
                {
                    this.loading.dismiss();
                    this.showPopup();
                    this.navCtrl.setRoot('LoginPage');
                }else {
                }
           })
   	    }
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

    showPopup() {
        let alert = this.alertCtrl.create({
            title: 'Success!',
            subTitle: 'Please login.',
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.navCtrl.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    showError(text) {
        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
}

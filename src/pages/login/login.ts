import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController} from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { Push, PushToken } from '@ionic/cloud-angular';

import { AuthService } from '../../providers/authService.provider';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    loading: Loading;
    loginCredentials = {email: '', password: '', platformID: '', registrationID: ''};
    constructor(
      	private navCtrl: NavController, 
        private loadingCtrl: LoadingController,
        private service: AuthService,
        private device: Device,
        private push: Push,
        private alertCtrl: AlertController) {
    }
    public createAccount() {
        this.navCtrl.push('ResetpasswordPage');
    }

  /*
    called when user click 'login' button
  */
    login() {
      
        this.showLoading();
        this.push.hasPermission()
          .then((res: any) => {
            if (res.isEnabled) {
              console.log('We have permission to send push notifications');
            } else {
              console.log('We do not have permission to send push notifications');
            }
          });

        const options: PushOptions = {
           android: {
           },
           ios: {
               alert: 'true',
               badge: true,
               sound: 'false',
           },
           windows: {},
           browser: {
               pushServiceURL: 'http://push.api.phonegap.com/v1/push'
           }
        };

        const pushObject: PushObject = this.push.init(options);
        pushObject.on('registration').subscribe((data: any) => {
           console.log('...........device Token...........');
           console.log(data.registrationId);
           this.loginCredentials.registrationID = data.registrationId;
        });
        pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


        /*this.push.register().then((t: PushToken) => {
          return this.push.saveToken(t);
        }).then((t: PushToken) => {
          console.log('Token saved:', t.token);
          this.loginCredentials.registrationID = t.token;
        });
 
        this.push.rx.notification()
          .subscribe((msg) => {
            console.log('I received awesome push: ' + msg);
        });*/

        var platform = this.device.platform;
        if(this.device.platform == 'Android')
        {
            this.loginCredentials.platformID = '2';
        }else if(this.loginCredentials.platformID = 'iOS'){
            this.loginCredentials.platformID = '1';
        }else{
            this.loginCredentials.platformID = '0';
        }
        console.log('...........Device Platform..........');
        console.log(this.device.platform); 

        this.service.login(this.loginCredentials,'E').then(data => {
            if(data.LoginResponds == '1' )
            {
                this.loading.dismiss();
                if(localStorage.getItem('userRef') != null)
                {
                    localStorage.removeItem('userRef');
                }
                localStorage.setItem('userRef', data.user_Ref);
                localStorage.setItem('email', data.EmailAddress);
                localStorage.setItem('count', '0');
                this.navCtrl.setRoot('FriendListPage');
          
            }else{
                this.showError(); 
                this.navCtrl.push('RegisterPage'); 
            }
    });

  };

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner:'bubbles'
        });
        this.loading.present();
    }
  
    showError() {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: 'You seem to have no account! Please register!',
            buttons: ['OK']
        });
            alert.present();
        }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { Base64 } from '@ionic-native/base64';
import { Device } from '@ionic-native/device';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Push, PushToken } from '@ionic/cloud-angular';

import { AuthService } from '../../providers/authService.provider';
import { facebookID } from '../../app/app.config';


/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-main',
    templateUrl: 'main.html',
})
export class MainPage {
    loading: Loading;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        private service: AuthService, 
        private base64: Base64,
        private device: Device,
        private push: Push,
        private loadingCtrl: LoadingController,
        private fb: Facebook,
        private tw: TwitterConnect,
        private googlePlus: GooglePlus )
    {
        this.fb.browserInit(facebookID, "v2.8");
    }

    socialLoginCredentials = {email: '', password: '', platformID: '', registrationID: ''};

    // Facebook Login
    doFbLogin(){
        this.fb.login(['public_profile', 'user_friends', 'email','user_posts'])
          .then((res: FacebookLoginResponse) =>{
              var userId = res.authResponse.userID;
              this.socialLoginCredentials.email = userId;
              this.showLoading();
              this.pushNotification();
              this.service.login(this.socialLoginCredentials,'F').then(logindata => {
                if(logindata.LoginResponds == '1' )
                {
                    if(localStorage.getItem('userRef') != null)
                    {
                        localStorage.removeItem('userRef');
                    }
                    localStorage.setItem('userRef', logindata.user_Ref);
                    localStorage.setItem('email', '');
                    localStorage.setItem('fbResponseID', userId);
                    localStorage.setItem('count', '0');
                    this.navCtrl.setRoot('FriendListPage');
                    this.loading.dismiss();
              
                }else{
                    this.getFbUserInformation();
                }
            });
        
          })
          .catch(e => console.log('Error logging into Facebook', e));
    }

    getFbUserInformation() {
        this.fb.getLoginStatus().then((response) => {
            if (response.status == 'connected') {
                var fbResponseID = response.authResponse.userID;
                this.fb.api('/' + fbResponseID + '?fields=first_name,last_name,email,picture', [])
                  .then((data) => {
                      var _firstName = JSON.parse(JSON.stringify(data)).first_name;
                      var _lastName = JSON.parse(JSON.stringify(data)).last_name;
                      var _email = fbResponseID;
                      var imgUrl = JSON.parse(JSON.stringify(data)).picture.data.url;
                      console.log('..........imgUrl..........');
                      console.log(imgUrl);

                      var registerCredentials = {firstName: _firstName, lastName: _lastName, email: _email, password: ''};
                      this.service.signup1(registerCredentials,'F')
                      .then(registerdata =>{
                          if(registerdata.LoginResponds == '1')
                          {
                              this.service.login(this.socialLoginCredentials,'F').then(logindata => {
                                  if(logindata.LoginResponds == '1' )
                                  {
                                      if(localStorage.getItem('userRef') != null)
                                      {
                                          localStorage.removeItem('userRef');
                                      }
                                      localStorage.setItem('userRef', logindata.user_Ref);
                                      localStorage.setItem('email', '');
                                      localStorage.setItem('fbResponseID', _email);
                                      localStorage.setItem('count', '0');
                                      this.navCtrl.setRoot('FriendListPage');
                                      this.loading.dismiss();
                                  }else{
                                    this.loading.dismiss();
                                  }
                              });
                              this.base64.encodeFile(imgUrl)
                                .then(imageData =>{
                                  console.log('...........base64............');
                                  console.log(imageData);
                                  this.service.updateUserProfile(imageData)
                                    .then(data=>{
                                      console.log('...imageUpdateSuccessfully...');
                                    })
                                    .catch(error=>{});
                                })
                                .catch(error=>{console.log(error);});
                          }
                      })
             
                    }, (error) => {
                      console.log(error);
                    })
            }
        })
    }

    
    // Twitter Login
    doTwLogin(){
        this.tw.login()
          .then((result) =>{
                this.showLoading();
                this.pushNotification();
                console.log("........1.this.tw.login........");
                console.log(result);
              //this.tw.showUser().then((data) => {
            //  console.log("..............twitter login info-------------");
            //  console.log(data);
                var registerCredentials = {firstName: '', lastName: '', email: '', password: ''};
                registerCredentials.firstName = result.userName;
                registerCredentials.email = result.userId;
                this.socialLoginCredentials.email = result.userId;
                this.service.login(this.socialLoginCredentials,'T').then(logindata => {
                if(logindata.LoginResponds == '1' )
                {
                    if(localStorage.getItem('userRef') != null)
                    {
                        localStorage.removeItem('userRef');
                    }
                    localStorage.setItem('userRef', logindata.user_Ref);
                    localStorage.setItem('email', '');
                    localStorage.setItem('count', '0');
                    this.navCtrl.setRoot('FriendListPage');
                    this.loading.dismiss();
              
                }else{
                    this.service.signup1(registerCredentials,'T')
                      .then(registerdata =>{
                          if(registerdata.LoginResponds == '1')
                          {
                              this.service.login(this.socialLoginCredentials,'T').then(logindata => {
                                if(logindata.LoginResponds == '1' )
                                {
                                    if(localStorage.getItem('userRef') != null)
                                    {
                                        localStorage.removeItem('userRef');
                                    }
                                    localStorage.setItem('userRef', logindata.user_Ref);
                                    localStorage.setItem('email', '');
                                    localStorage.setItem('count', '0');
                                    this.navCtrl.setRoot('FriendListPage');
                                    this.loading.dismiss();
                              
                                }else{
                                  this.loading.dismiss();
                                }
                            }).catch(error=>{console.log(error);});
                              
                          }else{
                            this.loading.dismiss();
                          }
                    }).catch(error=>{console.log(error);});
                }
              });
                
          //  }).catch(error=>{console.log(error);});
          }).catch(error => {console.log(error);});  
    }


    // Google Plus Login
    doGoogleLogin(){
        this.googlePlus.login({})
          .then((result) =>{
              this.showLoading();
              this.pushNotification();
              var registerCredentials = {firstName: '', lastName: '', email: '', password: ''};
              registerCredentials.firstName = result.displayName;
              registerCredentials.email = result.userId;
              console.log(".........google login.........");
              console.log(result.displayName);
              console.log(result.userId);

              this.socialLoginCredentials.email = result.userId;
              this.service.login(this.socialLoginCredentials,'G').then(logindata => {
                if(logindata.LoginResponds == '1' )
                {
                    if(localStorage.getItem('userRef') != null)
                    {
                        localStorage.removeItem('userRef');
                    }
                    localStorage.setItem('userRef', logindata.user_Ref);
                    localStorage.setItem('email', '');
                    localStorage.setItem('count', '0');
                    this.navCtrl.setRoot('FriendListPage');
                    this.loading.dismiss();
              
                }else{
                    this.service.signup1(registerCredentials,'G')
                      .then(registerdata =>{
                          if(registerdata.LoginResponds == '1')
                          {
                              this.service.login(this.socialLoginCredentials,'G').then(logindata => {
                                if(logindata.LoginResponds == '1' )
                                {
                                    if(localStorage.getItem('userRef') != null)
                                    {
                                        localStorage.removeItem('userRef');
                                    }
                                    localStorage.setItem('userRef', logindata.user_Ref);
                                    localStorage.setItem('email', '');
                                    localStorage.setItem('count', '0');
                                    this.navCtrl.setRoot('FriendListPage');
                                    this.loading.dismiss();
                              
                                }
                                else{
                                  this.loading.dismiss();
                                }
                              });
                          }else{
                            this.loading.dismiss();
                          }
                      })
                      .catch(error=>{
                        console.log("Google Sign Up error...", error);
                      });
                }
            });
        
          })
          .catch(e => console.log('Google_login_Error', e));
    }

    pushNotification() {
        this.push.register().then((t: PushToken) => {
          return this.push.saveToken(t);
        }).then((t: PushToken) => {
          console.log('Token saved:', t.token);
          this.socialLoginCredentials.registrationID = t.token;
        });
 
        this.push.rx.notification()
          .subscribe((msg) => {
            console.log('I received awesome push: ' + msg);
        });

        var platform = this.device.platform;
        if(this.device.platform == 'Android')
        {
            this.socialLoginCredentials.platformID = '2';
        }else if(this.socialLoginCredentials.platformID = 'iOS'){
            this.socialLoginCredentials.platformID = '1';
        }else{
            this.socialLoginCredentials.platformID = '0';
        }
        console.log('...........Device Platform..........');
        console.log(this.device.platform); 
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner:'bubbles'
        });
        this.loading.present();
    }

    gotosignup()
    {
        this.navCtrl.push('RegisterPage');
    }
  
    gotologin()
    {
        this.navCtrl.push('LoginPage');
    }

    gotoAbout()
    {
        this.navCtrl.push('AboutPage');
    }

   
}

import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';

import { AuthService } from '../../providers/authService.provider';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})

export class UserPage {

    loading: Loading;
    password:any;
    profilepicture:string = "assets/img/placeholder.png";
    user = {firstName : '', lastName : '', email:'', password:'', phonenumber:''};
    constructor(
        public nav: NavController, 
        public service: AuthService, 
        private loadingCtrl: LoadingController, 
        public toastCtrl: ToastController,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private fb: Facebook,
        public tw: TwitterConnect,
        private googlePlus: GooglePlus)
        {
            this.showLoading();
            this.service.getUserInfo(localStorage.getItem('userRef')).then(data => {
                
                    this.loading.dismiss();
                    if(data.ProfilePicture != null){
                        this.profilepicture = data.ProfilePicture;
                    }
                    this.user.firstName = data.FirstName;
                    this.user.lastName = data.LastName;
                    this.user.email = data.EmailAddress;
                    this.user.phonenumber = data.PhoneNumber;
                    this.password = data.Password;
                    console.log('.........password.........');
                    console.log(this.password);

            }).catch(error=>{});
        }

    SelectImage()
    {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select your profile image',
            buttons: [
                {
                    text: 'Camera',
                    handler: () => {
                      const optionsForCamera: CameraOptions = {
                          quality: 100,
                          destinationType: this.camera.DestinationType.DATA_URL,
                          sourceType: this.camera.PictureSourceType.CAMERA,
                          encodingType: this.camera.EncodingType.JPEG,
                          targetWidth: 160,
                          targetHeight: 160,
                          saveToPhotoAlbum: false
                      };
                      this.camera.getPicture(optionsForCamera).then((imageData) => {
                          //imageData is either a base64 encoded string or a file URI
                          //If it's base64:
                         this.profilepicture = 'data:image/jpeg;base64,' + imageData;
                         this.service.updateUserPhoto(this.profilepicture);
                      }, (err) => {
                          //Handle error
                      });


                    }
                },
                {
                    text: 'Photo Library',
                    handler: () => {
                       const optionsForLibrary: CameraOptions = {
                           quality: 100,
                           destinationType: this.camera.DestinationType.DATA_URL,
                           sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                           encodingType: this.camera.EncodingType.JPEG,
                           targetWidth: 160,
                           targetHeight: 160,
                           saveToPhotoAlbum: false
                      };
                      this.camera.getPicture(optionsForLibrary).then((imageData) => {
                          //imageData is either a base64 encoded string or a file URI
                          //If it's base64:
                          this.profilepicture = 'data:image/jpeg;base64,' + imageData;
                          this.service.updateUserPhoto(this.profilepicture);
                      }, (err) => {
                          //Handle error
                      });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }
    /*
        Called when user click 'logout' button
    */
    logout() {
        localStorage.clear();
        this.fb.logout();
        this.tw.logout();
        this.googlePlus.logout();
        this.nav.setRoot('MainPage');
    };
    /*
        Called when user click 'save' button
    */
    saveProfile()
    {
        this.service.updateUserProfile(this.user)
         .then(data=>{
           this.showToast("Save successfully");
         });
    }


    showLoading()
    {
        this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: 'Please wait'

        });
        this.loading.present();
    }

    showToast(content) {
    const toast = this.toastCtrl.create({
      message: content,
      duration: 1500,
      cssClass: "toastClass",
    });
    toast.present();
    }

}

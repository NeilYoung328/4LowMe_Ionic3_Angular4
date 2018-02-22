import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts'
import { SMS } from '@ionic-native/sms';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ContactDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-contact-detail',
    templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {
    loading: Loading;
    //contactlist = new Array();
    contactNameArray = new Array();
    contactNumberArray = new Array();

    constructor(
    	public navCtrl: NavController, 
    	public navParams: NavParams,
      private loadingCtrl: LoadingController,
    	private contacts: Contacts,
      private sms: SMS,
      private alertCtrl: AlertController,
      public toastCtrl: ToastController,) {
        
    }

    contact() {
        this.showLoading();
        var opts = {
          filter : "",
          multiple : true
        };
        this.contacts.find(['formatted','phoneNumbers'],opts)
          .then(data =>{
            data.forEach((contactArray)=>{
              this.contactNameArray.push(contactArray.name.formatted);
              this.contactNumberArray.push(contactArray.phoneNumbers[0].value);
            });
              //this.contactlist = data;
              this.loading.dismiss();
              console.log(data);
          })
          .catch(error=>{});
    }

    sendSMS(phoneNumber){
        this.sms.send(phoneNumber,'Please Join me on FollowMe by clicking https://itunes.apple.com/us/app/4lowme/id1083794895?mt=8')
          .then(data=>{
              this.showToast('Send message successfully');
          })
          .catch(error=>{
              this.doAlert("Can't connect the server");
          })
    }

    doAlert(content) {
      let alert = this.alertCtrl.create({
        title: 'Your Request',
        subTitle: content,
        buttons: ['Ok']
      });

    alert.present();
    }

    showToast(content) {
      const toast = this.toastCtrl.create({
        message: content,
        duration: 1500,
        cssClass: "toastClass",
      });
      toast.present();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner:'bubbles',
            enableBackdropDismiss: true
        });
        this.loading.present();
    }

    ionViewWillEnter() {
      this.contactNameArray = [];
      this.contactNumberArray = [];
      this.contact();
    }
}

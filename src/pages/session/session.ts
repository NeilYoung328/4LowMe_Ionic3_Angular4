import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Config, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/authService.provider';

/**
 * Generated class for the SessionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-session',
    templateUrl: 'session.html',
})
export class SessionPage {
    properties: Array<any>;
	session: string = "active";
    isAndroid: boolean = false;
    activeSession = new Array();
    archivedSession = new Array();
    deleteArchiveSession = new Array() as Array<boolean>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
        private service : AuthService,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public config: Config, ) {

    }


    activeSelected(property: any) {
        this.navCtrl.push('MapPage', property);
    }
    
    archivedSelected(property: any) {
        this.navCtrl.push('ScreenshotPage', property);
    }

    endSession(requestRef) {
        this.service.endSessionForIndividual(requestRef)
        .then(data => {
            this.activeSession = [];
        })
        .catch(error => {
        });
    }

    // delete session from Archived session list
    deleteArchivedSession(requestRef,i) {
        this.deleteArchiveSession[i] = true;
        this.service.deleteFollowSession(requestRef)
        .then(data => {
            this.showToast("Deleted Session successfully");
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
        })
    }

    
    getSession() {
        this.service.getSession()
        .then(data => {
            for (var key in data) {
                var timeout = new Date(data[key].sessionTimeOut);
                var now = new Date();            
                if (now.getTime() < timeout.getTime() && data[key].InSessionFlag == "True") {
                    this.activeSession.push(data[key]);
                } else {
                    this.archivedSession.push(data[key]);

                }
            }
        })
        .catch(error => {
        })
    }

    ionViewWillEnter() {
        this.activeSession = [];
        this.archivedSession = [];
        this.getSession();
    }

    refresh() {
        this.ionViewWillEnter();
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
}

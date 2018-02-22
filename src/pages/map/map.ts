import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Screenshot } from '@ionic-native/screenshot';

import { AuthService } from '../../providers/authService.provider';
import { MapboxService } from '../../providers/mapboxService.provider';
import { LocationService } from '../../providers/locationService.provider';
import { mapboxStyle, mapboxZoom, intervalSession} from '../../app/app.config';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class MapPage {
    loading: Loading;
	properties: Array<any>;
    currentFollowSessionList = new Array(); //Array for the list of current session
    activeSession:any;
    updateSessionInterval:any;
    activeSessionRequestRef:any;
    followMembers = new Array();
    userLocationLongitute: number;
    userLocationLatitude: number;
    friendLocationLatitudeArray = new Array();
    friendLocationLongituteArray = new Array();
    distanceMilesRound: number; // value that Rounded the distance with Math
    followMemberRef = new Array(); // Array of all followMembers UserRef
    distanceArray = new Array(); // Array of all followMembers distance
    profilePic = new Array(); // Array of all followMembers profilePic
    timeDiff:any;
    speed = new Array();
    timer:any;
    sessionDelayTimer: any;
    endSessionTimer: any;
    x:any;


    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public service: AuthService,
        private mapbox: MapboxService,
        private location: LocationService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private shot: Screenshot,
        ) {
        
    }
    ionViewWillEnter() {
        this.speed = [];
        this.profilePic = [];
        this.friendLocationLongituteArray = [];
        this.friendLocationLatitudeArray = [];
        this.followMembers = [];
        this.followMemberRef = [];
        this.distanceArray = [];
        this.mapbox.sessionMap.routeArray = [];
        this.mapbox.sessionMap.userMarkerArray = [];
        this.mapbox.sessionMap.directionArray = [];
        this.getSession();
    }
   
    ionViewWillLeave() {
        console.log('leave...');
        //clearTimeout(this.timer);
        //clearTimeout(this.sessionDelayTimer);
        clearInterval(this.updateSessionInterval);
        this.mapbox.sessionMap.map.remove();
        clearInterval(this.x);
    }


    // Capture screen and save image file not only on the phone ,but also on the server
    screenshot() {
        /*this.shot.save('jpg',80,'myscreenshot')
        .then(data=>{
            this.showToast("Capture screen successfully");
            //this.toBase64Url();
        })
        .catch(error=>{
            this.doAlert("Can't connect the server");
        });*/
        console.log("....screenshot worked....");
        this.showLoading();
        this.shot.URI(80)
        .then(res=>{
            this.service.saveSessionImage(this.activeSessionRequestRef, res.URI)
            .then(data=>{
                this.loading.dismiss();
                this.showToast("Capture screen successfully");
            }).catch(error=>{
                this.doAlert("Can't connect the server");
            });
        }).catch(error=>{});
    }

    
    // get the current session list
    getSession() {
        this.showLoading();
        this.service.getSession()
          .then(data => {
              console.log('Session got.');
              //localStorage.setItem('count', '0');
             // for (var key in data) {
                  var timeout = new Date(data[0].sessionTimeOut).getTime();
                  var now = new Date().getTime();
                  var timeDifference = timeout - now;
                  if ( timeDifference > 0 && data[0].InSessionFlag == "True") {
                      console.log(timeDifference); 
                      this.x = setInterval(function() {
                        var nows = new Date().getTime();
                        var distance = timeout - nows;
                        //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        document.getElementById("durationCounter").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
                        if (distance < 0) {
                            clearInterval(this.x);
                            document.getElementById("durationCounter").innerHTML = "EXPIRED";
                        }
                    }, 1000);

                      this.activeSession = data[0];
                      this.activeSessionRequestRef = data[0].FollowRequest_Ref;
                      this.timeDiff = timeDifference/1000/3600;
                      this.getSessionDetail();
                      
                      //clearTimeout(this.endSessionTimer);
                      if (localStorage.getItem('count') == '0') {
                          this.timer = setTimeout(()=> { this.screenshot(); localStorage.setItem('count', '0');}, timeDifference-60000);
                          this.sessionDelayTimer = setTimeout(()=> { this.doConfirm(this.activeSessionRequestRef); localStorage.setItem('count', '0');}, timeDifference-30000);
                          localStorage.setItem('count', '1');
                      }
                      //this.endSessionTimer = setTimeout(()=> { console.log('..Session Ended..'); this.endSession(this.activeSessionRequestRef); }, timeDifference);
                  }
              //}
              this.showMap(false);
          })
          .catch(error => {
              console.log('Failed.')
          });
    }

    endSession(requestRef) {
        this.service.endSessionForIndividual(requestRef)
        .then(data => {
            
        })
        .catch(error => {
        });
    }


    // get every members list of active follow session
    getSessionDetail() {
        
        console.log('detail...');
            this.service.getSessionInfoInDetail(this.activeSession.FollowRequest_Ref).then((res) => {
                if(res.RequestData != null){
                    res.RequestData.forEach((_user) =>{
                       // if(_user.UserRef != localStorage.getItem('userRef')){
                            this.followMembers.push(_user.UserName);
                            this.followMemberRef.push(_user.UserRef);
                                var DetailLength = _user.locationDetails.length;
                                if(DetailLength > 2){
                                    var nextLogitude = _user.locationDetails[DetailLength-1].Logitude;
                                    var nextLatitude = _user.locationDetails[DetailLength-1].Latitude;
                                    var beforeLogitude = _user.locationDetails[DetailLength-2].Logitude;
                                    var beforeLatitude = _user.locationDetails[DetailLength-2].Latitude;
                                    var distanceBetweenTwoPoint = this.mapbox.distance(beforeLatitude, beforeLogitude, nextLatitude, nextLogitude);
                                    this.speed.push(Math.round(distanceBetweenTwoPoint * 6 * 60));
                                }else{
                                    this.speed.push(0);
                                }
                            
                      //  }        
                    });
                    this.currentUserLocation();
                    for(var key in this.followMemberRef){
                        this.getFollowMemberProfilePicture(this.followMemberRef[key]);
                    }
                }
            });
    }

    /*
        show map in real device
    */
    showMap(_update) {
        console.log('showmap...');
        this.location.getCurrentLocation().then((cpos: any) => {
            let mapOptions = {
                container: 'session_map',//map container id selector
                style: mapboxStyle,//map style from app.config.ts
                zoom: mapboxZoom,//map zoom level from app.config.ts
                center: [cpos.longitude, cpos.latitude], // starting position [lng, lat]
            };
            let dataOptions = {
                currentlon: cpos.longitude,
                currentlat: cpos.latitude,
                detail: null
            };
            if(_update==false){
                this.mapbox.showSessionMap(false, mapOptions, dataOptions).then((res) => {
                this.loading.dismiss();
                        this.service.getSessionInfoInDetail(this.activeSession.FollowRequest_Ref).then((res) => {
                            if(res.RequestData != null){
                                dataOptions.detail = res.RequestData;
                                this.mapbox.showSessionMap(true, null, dataOptions);
                            }
                        });
                    this.updateSessionInterval = setInterval(() => {
                        this.showMap(true);
                    }, intervalSession);
                });
            }else{
                    this.service.getSessionInfoInDetail(this.activeSession.FollowRequest_Ref).then((res) => {
                        if(res.RequestData != null){
                            res.RequestData.forEach((_user) =>{
                               // if(_user.UserRef != localStorage.getItem('userRef')){
                                var DetailLength = _user.locationDetails.length;
                                if(DetailLength > 2){
                                    var nextLogitude = _user.locationDetails[DetailLength-1].Logitude;
                                    var nextLatitude = _user.locationDetails[DetailLength-1].Latitude;
                                    var beforeLogitude = _user.locationDetails[DetailLength-2].Logitude;
                                    var beforeLatitude = _user.locationDetails[DetailLength-2].Latitude;
                                    var distanceBetweenTwoPoint = this.mapbox.distance(beforeLatitude, beforeLogitude, nextLatitude, nextLogitude);
                                    this.speed.push(Math.round(distanceBetweenTwoPoint * 6 * 60));
                                }else{
                                    this.speed.push(0);
                                }
                                    
                              //  }        
                            });
                            this.currentUserLocation();
                            dataOptions.detail = res.RequestData;
                            this.mapbox.showSessionMap(true, null, dataOptions);
                        }
                    });
            }
        });
    };

    // get current user location and all distances from followMembers
    currentUserLocation() {
        this.service.getUserLocation()
        .then(data => {
            this.userLocationLatitude = data[0].Latitude;
            this.userLocationLongitute = data[0].Longitute;
            for(var key in this.followMemberRef){
                this.getFriendLocation(this.followMemberRef[key]);
            }

        })
        .catch(error => {
        });
    }

    // get friend location and distance from him
    getFriendLocation(friendRef) {
        this.service.getFriendLocation(friendRef)
        .then(data=>{
            var friendLocationLatitude = data[0].Latitude;
            var friendLocationLongitute = data[0].Longitute;
            var distanceMiles = this.mapbox.distance(this.userLocationLatitude, this.userLocationLongitute, friendLocationLatitude, friendLocationLongitute);
            this.distanceMilesRound = Math.round(distanceMiles);
            this.distanceArray.push(this.distanceMilesRound);
            this.friendLocationLatitudeArray.push(friendLocationLatitude);
            this.friendLocationLongituteArray.push(friendLocationLongitute);
        })
        .catch(error=>{});
    }

    getFollowMemberProfilePicture(friendRef) {
        this.service.getFriendProfilePic(friendRef)
        .then(data=>{
            this.profilePic.push(data);
        }).catch(error=>{});
    }

    doAlert(content) {
    let alert = this.alertCtrl.create({
      title: 'Your Request',
      subTitle: content,
      buttons: ['Ok']
    });

    alert.present();
    }

    doConfirm(requestRef) {
    let alert = this.alertCtrl.create({
      title: 'Session Time',
      message: 'Do you agree to extend session time?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            //clearTimeout(this.sessionDelayTimer);
            clearInterval(this.x);
            clearInterval(this.updateSessionInterval);
            this.endSession(requestRef);
          }
        },
        {
          text: 'Agree',
          handler: () => {
            //clearTimeout(this.endSessionTimer);
            this.service.extendSessionTime(requestRef)
            .then(data=>{})
            .catch(error=>{});
            clearInterval(this.x);
            //this.mapbox.sessionMap.map.remove();
            clearInterval(this.updateSessionInterval);
            this.getSession();
          }
        }
      ]
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
            spinner: 'bubbles',
            enableBackdropDismiss: true
        });
        this.loading.present();
    }
}

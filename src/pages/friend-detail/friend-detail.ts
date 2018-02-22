import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/authService.provider';
import { MapboxService } from '../../providers/mapboxService.provider';
import { mapboxStyle, mapboxZoom} from '../../app/app.config';

/**
 * Generated class for the BrokerDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-friend-detail',
    templateUrl: 'friend-detail.html',
})


export class FriendDetailPage {

    personalInfo: any;
    userLocationLongitute = 0;
    userLocationLatitude = 0;
    friendLocationLongitute = 0;
    friendLocationLatitude = 0;
    distanceMilesRound: any;

    constructor(
    	public navCtrl: NavController, 
    	public navParams: NavParams,
    	private service: AuthService,
        private mapbox: MapboxService) {
        this.personalInfo = this.navParams.data;
    }

    currentUserLocation(friendRef) {
        this.service.getUserLocation()
        .then(data => {
            this.userLocationLatitude = data[0].Latitude;
            this.userLocationLongitute = data[0].Longitute;
            console.log(this.userLocationLongitute + ":" +this.userLocationLatitude);
            this.service.getFriendLocation(friendRef)
                .then(data=>{
                    this.friendLocationLatitude = data[0].Latitude;
                    this.friendLocationLongitute = data[0].Longitute;
                    console.log(this.friendLocationLongitute + ":" +this.friendLocationLatitude);
                    
                    let mapOptions = {
                        container: 'user_map',//map container id selector
                        style: mapboxStyle,//map style from app.config.ts
                        zoom: mapboxZoom,//map zoom level from app.config.ts
                        center: [this.friendLocationLongitute, this.friendLocationLatitude], // starting position [lng, lat]
                      };
                    if(this.friendLocationLatitude == 0 || this.friendLocationLongitute == 0){
                        this.distanceMilesRound = 0;
                    }else{
                        var distanceMiles = this.mapbox.distance(this.userLocationLatitude, this.userLocationLongitute, this.friendLocationLatitude, this.friendLocationLongitute);
                        this.distanceMilesRound = Math.round(distanceMiles);
                        this.mapbox.showUserMap(mapOptions);
                    }
                })
                .catch(error=>{});
        })
        .catch(error => {
            console.log("can't get location");
        });
    }

    toggleSelection(friendRef, toggle)
    {
        this.service.determineMyLocationShareOrNot(friendRef, toggle)
        .then(data => {
        })
        .catch(error => {
        });

    }

    ionViewWillEnter() {
      this.currentUserLocation(this.personalInfo.User_Ref);
    }
    ionViewWillLeave() {
      this.mapbox.userMap.map.remove();
    }
}

import { Injectable } from '@angular/core';
//import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
//import { Platform } from 'ionic-angular';

import { intervalTime } from '../app/app.config';
import { AuthService } from './authService.provider';
@Injectable()
export class LocationService {
    locationInterval;
    geoOptions = {
        maximumAge: 0,
        enableHighAccuracy: false
    };
  constructor(
    //private diagnostic:Diagnostic, 
    private geolocation: Geolocation, 
    //private platform: Platform,
    private auth: AuthService){
    };
    /*
      get current location
    */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition(this.geoOptions)
              .then((resp) =>{
                  //console.log('current location is' + ' lat: ' + resp.coords.latitude + ' lon: ' + resp.coords.longitude);
                  //console.log('current speed is' + resp.coords.speed);
                  resolve(resp.coords);
              }).catch((err) =>{
                reject('geolocation error');
              });
        });
    };
    /*
      update current location to server
    */
    updateCurrentLocation(){
        //console.log('update location');
        clearInterval(this.locationInterval);
        this.auth.getSession()
        .then(data => {
            for (var key in data) {
                var timeout = new Date(data[key].sessionTimeOut);
                var now = new Date();            
                this.locationInterval = setInterval(()=> {
                    if(localStorage.getItem('userRef') !== null || now.getTime() < timeout.getTime() && data[key].InSessionFlag == "True"){
                        this.getCurrentLocation().then((position: any) => {
                            this.auth.updateUserLocation(position.longitude, position.latitude).then((res) => {
                                //console.log('update location successfully!');
                            }).catch((err) => {
                                console.log('update location error!');
                            });
                        });
                    }else{
                        clearInterval(this.locationInterval);
                    }
                }, intervalTime);
            }
        })
        .catch(error => {
        });
        
    };

}
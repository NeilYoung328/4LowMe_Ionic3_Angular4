import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { Contacts } from '@ionic-native/contacts';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { Screenshot } from '@ionic-native/screenshot';
import { Base64 } from '@ionic-native/base64';
import { SMS } from '@ionic-native/sms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { HttpModule } from '@angular/http';
import { FollowMe } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProvidersModule } from '../providers/providers.module'

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '14b7d537'
  },
  'push': {
    'sender_id': '1012623683554',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#ff0000'
      }
    }
  }
};
@NgModule({
    declarations: [
		FollowMe
    ],
    imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(FollowMe, { swipeBackEnabled: false }),
		CloudModule.forRoot(cloudSettings),
		ProvidersModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
		FollowMe
    ],
    providers: [
		StatusBar,
		SplashScreen,
		Camera,
		Geolocation,
		Diagnostic,
		Contacts,
		Facebook,
		TwitterConnect,
		GooglePlus,
		Screenshot,
		Base64,
		SMS,
		SocialSharing,
		Device,
		Push,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}

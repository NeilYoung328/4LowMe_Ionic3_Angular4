import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Config, AlertController, Loading, LoadingController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { AuthService } from '../../providers/authService.provider';
import { LocationService } from '../../providers/locationService.provider';

/**
 * Generated class for the PropertyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage()
@Component({
    selector: 'page-friend-list',
    templateUrl: 'friend-list.html',
})

export class FriendListPage {
    loading: Loading;

    disappear:boolean = false; // Flag that remove the search result item when click "Add to list" button
    isEnabled:boolean = true; // Flag that determine whether enable "Send friend request" button or not
    isFollowEnabled:boolean = true; // Flag that determine whether enable "Follow request" button or not
    isToggled = true;
    properties: Array<any>;
    searchKey: string = "";
    viewMode: string = "addfriend";
    sendrequest: string = "send";
    followrequest: string= "follow";
    testRadioOpen = false;
    sessionDurationResult: any; //Array for the session duration time
    selectedperson = new Array(); //Array for the new list of candidate added after search
    friendCandidateList = new Array(); //Array for all requests of friends and follows
    friendList = new Array(); //Array for all friends in follow segment
    friendSelect = new Array(); //Array for the value of toggle(true/false) in follow segment
    friendArray = new Array(); // Array for friends that toggle is true
    pendingFriendRequest = new Array(); //Array for the list of pending friend request
    pendingFollowRequest = new Array(); //Array for the list of pending follow request
    acceptHideInAcceptFriendRequest = new Array() as Array<boolean>;
    deleteFriendRequest = new Array() as Array<boolean>;
    acceptHideInAcceptFollowRequest = new Array() as Array<boolean>;
    top3Friends = new Array(); // Array for dashboard
    top34LowSessions = new Array(); // Array for dashboard
    closetFriends = new Array(); // Array for dashboard
    activeSessionCount:any; 
    fbFriendsID = new Array();
    fbFriendsData = new Array();
    showFbFriendSegment:boolean;

    constructor(
    	  public navCtrl: NavController,
     	  public service: AuthService, 
     	  public config: Config, 
     	  public navParams: NavParams,
        private fb: Facebook,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private  location: LocationService) 
    {
      this.fbFriendsData = [];
      this.getFbFriends();
    }

    // go to contacts page
    gotoContactPage() {
      this.navCtrl.push('ContactDetailPage');
    }

    // go to friend-detail page with property data
    openPropertyDetail(property: any) {
        this.navCtrl.push('FriendDetailPage', property);
    }

    gotoFriendTab(value) {
      this.viewMode = value;
    }

    openFriendInfo(property: any) {
      this.navCtrl.push('FriendInfoPage', property);
    }

    //go to map page
    gotoMapPage() {
      this.navCtrl.push('MapPage');
    }

    // go to user page
    gotoUserPage()
    {
        this.navCtrl.push('UserPage');
    }

    // go to session page
    gotosession()
    {
        this.navCtrl.push('SessionPage');
        this.ionViewWillEnter();
    }


    // called when input name on the search bar
    onInput(event) {
        this.disappear = false;
        if(this.searchKey !== ""){
          this.service.searchForUser(this.searchKey)
          .then(data => {
              this.properties = data;
          })
          .catch(error => alert(error));
        }else{
          this.disappear = true;
        }
    }


    // send the friend request
    sendRequestToFriend(ref) {
        this.selectedperson = [];
        this.disappear = true;
        this.selectedperson.push(ref);
        this.service.sendRequestToFriend(this.selectedperson)
            .then(data => {
                this.showToast("Sent successfully");
           //     console.log("sent request sent!")
            })
            .catch(error => {
                this.doAlert("Can't connect the server");
            });
    }

    // get facebook friends
    getFbFriends() {
      var fbResponseID = localStorage.getItem('fbResponseID');
      if(fbResponseID != null){
      this.showFbFriendSegment = true;
      this.fb.api('/' + fbResponseID + '/friends', [])
        .then((result) => {
          console.log(result.data);
          var fbFriends = result.data;
          for(var key in fbFriends){
            this.fbFriendsID.push(fbFriends[key].id);
          }
          console.log(this.fbFriendsID);
          this.service.facebookFriend(this.fbFriendsID)
          .then(data=>{
            this.fbFriendsData = data;
          }).catch(error=>{console.log(error);});
        })
        .catch(error=>{console.log(error);});
      }else{
        this.showFbFriendSegment = false;
      }
    }


    // get all friend and follow requests
    getRequestToFriendAndFollow() {
        this.service.getRequestToFriendAndFollow()
            .then(data => {
                this.friendCandidateList = data;
                for (var i = 0; i <= this.friendCandidateList.length - 1; i++) {
                    if(this.friendCandidateList[i].Request_Type_Ref ==1)
                    {
                        this.pendingFriendRequest.push(this.friendCandidateList[i]);
                    }
                    else{
                        this.pendingFollowRequest.push(this.friendCandidateList[i]);
                    }
                } 
            })
            .catch(error => alert(error));
    }

    // delete friend and follow request
    deleteFriendAndFollowRequest(requestRef,i,j){
        this.acceptHideInAcceptFriendRequest[i] = true;
        this.acceptHideInAcceptFollowRequest[j] = true;
        this.service.deleteFriendAndFollowRequest(requestRef)
        .then(data => {
            this.showToast("Deleted the request successfully");
         //   console.log("deleted request!")
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
         //   console.log("not deleted!")
        });
    }

    // accept the friend request from others
    acceptRequestToAddFriend(Request_Ref, From_UserRef,i) {
        this.acceptHideInAcceptFriendRequest[i] = true;
        this.service.acceptRequestToAddFriend(Request_Ref, From_UserRef)
        .then(data => {
            this.showToast("Accept the request successfully");
       //     console.log("Accept!");
            this.getFriendList();
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
        });
    }

    // get all friends
    getFriendList() {
        this.service.getFriendList()
        .then(data => {
            this.friendList = data;
        })
        .catch(error => {
        //    console.log("Can't get the friend list , because of bad connection");
        });
    }

    // get array of friends that toggle is on
    friendSelection(userRef, index)
    {
       // console.log(index);
       // console.log(userRef);
        if(this.friendSelect[index] == true)
        {
            this.friendArray.push(userRef);
        }
        else {
            this.friendArray.splice(this.friendArray.indexOf(userRef), 1);
        }
        console.log(this.friendArray);
       if(this.friendArray.length >0){
             this.isFollowEnabled = false;
           }else{ this.isFollowEnabled = true;}

    }

    // delete friend
    deleteFriend(friendRef,i){
        this.deleteFriendRequest[i] = true;
        this.service.deleteFriend(friendRef)
        .then(data => {
            this.showToast("Deleted the friend successfully");
        //    console.log("deleted!")
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
        //    console.log("not deleted!")
        });
    }

    // send the follow request
    sendRequestToFollow() {
        this.service.sendRequestToFollow(this.friendArray, this.sessionDurationResult)
        .then(data => {
            this.location.updateCurrentLocation();
            this.showToast("Sent successfully");
        //    console.log("follow request sent!")
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
        });
    }

    // accept the follow request from others
    acceptFollowRequest(Request_Ref,From_UserRef,i) {
        this.acceptHideInAcceptFollowRequest[i] = true;
        this.service.acceptFollowRequest(Request_Ref,From_UserRef)
        .then(data => {
            this.location.updateCurrentLocation();
            this.showToast("Accept the request successfully");
         //   console.log("Accept!");
        })
        .catch(error => {
            this.doAlert("Can't connect the server");
        });
    }

    getDashboardData() {
      this.top3Friends = [];
      this.top34LowSessions = [];
      this.closetFriends = [];
      this.showLoading();
      this.service.getDashboardValue()
      .then(data=>{
        this.loading.dismiss();
        this.top3Friends = data.top3Friends;
        this.top34LowSessions = data.top34LowSessions.SessionInfomation;
        this.closetFriends = data.ClosetFriends;
        this.activeSessionCount = data.ActiveSessionsCount.Count;
      })
      .catch(error=>{

      });
    }
    

    // Alert called when click "follow me" button
    sessionDuration() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Select Session Time');

        alert.addInput({
          type: 'radio',
          label: '10 min',
          value: '10',
          checked: true
        });

        alert.addInput({
          type: 'radio',
          label: '1 hour',
          value: '60'
        });

        alert.addInput({
          type: 'radio',
          label: '2 hours',
          value: '120'
        });

        alert.addInput({
          type: 'radio',
          label: '3 hours',
          value: '180'
        });

        alert.addInput({
          type: 'radio',
          label: '4 hours',
          value: '240'
        });

        alert.addInput({
          type: 'radio',
          label: '5 hours',
          value: '300'
        });

        alert.addInput({
          type: 'radio',
          label: '6 hours',
          value: '360'
        });

        alert.addInput({
          type: 'radio',
          label: '7 hours',
          value: '420'
        });

        alert.addInput({
          type: 'radio',
          label: '8 hours',
          value: '480'
        });

        alert.addInput({
          type: 'radio',
          label: '9 hours',
          value: '540'
        });

        alert.addInput({
          type: 'radio',
          label: '10 hours',
          value: '600'
        });

        alert.addButton('Cancel');
        alert.addButton({
          text: 'Ok',
          handler: (data: any) => {
        //    console.log('Radio data:', data);
            this.testRadioOpen = false;
            this.sessionDurationResult = data;
            this.sendRequestToFollow();
          }
        });

        alert.present();
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
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            spinner:'bubbles'
        });
        this.loading.present();
    }

    private dismissHandler() {
    console.info('Toast onDidDismiss()');
    }

    ionViewWillEnter() {
      this.pendingFollowRequest = [];
      this.pendingFriendRequest = [];
      this.fbFriendsID = [];
      this.getRequestToFriendAndFollow();
      this.getFriendList();
    }


    refresh() {
      this.ionViewWillEnter();
    }


}

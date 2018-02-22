import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import  {REMOTE_URL, Authorization} from '../app/app.config'
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
    constructor(public http: Http) {
        this.http = http;
    }

    data = {
        FirstName:'test45',
        lastName:'te45st',
        signIn : 'dks1212jkdj',
        password:'21111',
        typeFlag:'E'
    };

    // register new user
    signup1(regInfo,flag){

        var signupurl = REMOTE_URL + 'api/Register';
        var data1 = JSON.stringify({FirstName: regInfo.firstName, lastName: regInfo.lastName, signIn: regInfo.email, password: regInfo.password, typeFlag: flag});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(signupurl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // log in
    login (loginInfo,flag){

        var loginurl = REMOTE_URL + 'api/Login';
        var data1 = JSON.stringify({signIn: loginInfo.email, password: loginInfo.password, platformID: loginInfo.platformID, deviceID: loginInfo.registrationID, typeFlag: flag});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(loginurl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // user info who logged in
    getUserInfo(userRef){

        var getuserinfourl = REMOTE_URL + 'api/GetUserInfo' + '?UserRef=' + userRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getuserinfourl, Option)
            .toPromise().
            then (response => {
                return response.json();

            })
            .catch(err =>{ return '-1'});
    }

    // reset password in login page
    resetPassword(email){

        var resetPassUrl = REMOTE_URL + 'api/ResetPassword';
        var data1 = JSON.stringify({EmailAddress: email});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(resetPassUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // change user profile
    updateUserProfile(updateProfileInfo){

        var updateProfileUrl = REMOTE_URL + 'api/UpdateUserProfile';
        console.log(updateProfileInfo);
        var data1 = JSON.stringify({FirstName: updateProfileInfo.firstName,LastName: updateProfileInfo.lastName, User_Ref : localStorage.getItem('userRef'), Password : updateProfileInfo.password, PhoneNumber: updateProfileInfo.phonenumber});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(updateProfileUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();

            })
            .catch(err =>{ return '-1'});
    }

    // change the user photo
    updateUserPhoto(photoImage){

        var updateProfilePhotoUrl = REMOTE_URL + 'api/UpdateUserProfilePicture';
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef'), ProfilePicture: photoImage});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(updateProfilePhotoUrl, data1, Option)
            .toPromise().
            then (response => {
                console.log("updateUserPhoto");
                console.log(response.json());
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // search candidate for new friend
    searchForUser(searchUserName){
        
        var searchForUserUrl = REMOTE_URL + 'api/UserSearch';
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef'), searchText : searchUserName});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(searchForUserUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // send friend request to candidate after search
    sendRequestToFriend(userRef){
        
        var sendRequestToFriendUrl = REMOTE_URL + 'api/followRequest';
        var data1 = JSON.stringify({FromUserRef : localStorage.getItem('userRef'), ToUserRef : userRef,   RequestTypeRef:1});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Put", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.put(sendRequestToFriendUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get all friend and follow request from others
    getRequestToFriendAndFollow(){
        
        var sendRequestToFriendUrl = REMOTE_URL + 'api/followRequest' + '?UserRef=' + localStorage.getItem('userRef');
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(sendRequestToFriendUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // delete friend and follow request
    deleteFriendAndFollowRequest(requestRef){
        
        var deleteFriendAndFollowRequestUrl = REMOTE_URL + 'api/followRequest' + '?RequestRef=' + requestRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Delete", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.delete(deleteFriendAndFollowRequestUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // accept the friend request from others
    acceptRequestToAddFriend(Request_Ref, From_UserRef){
        
        var addFriendUrl = REMOTE_URL + 'api/Friend';
        var data1 = JSON.stringify({RequestRef : Request_Ref,  RequesterUserRef: From_UserRef, RecieverUserRef : localStorage.getItem('userRef')});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(addFriendUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get all friends
    getFriendList(){

        var addFriendUrl = REMOTE_URL + 'api/Friend' + '?UserRef=' +  localStorage.getItem('userRef') +'&' + 'Start=' + 0 + '&' + 'end=' + 10;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(addFriendUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // delete friend
    deleteFriend(friendUserRef){

        var deleteFriendUrl = REMOTE_URL + 'api/Friend';
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Delete", "Authorization": Authorization});
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef'), FriendUserRef : friendUserRef});
        let Option = new  RequestOptions({ headers: Header, body : data1});
        return this.http.delete(deleteFriendUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // determine whether to share user's location info or not
     determineMyLocationShareOrNot(friendRef, toggle){
        
        var determineMyLocationShareOrNotUrl = REMOTE_URL + 'api/FriendSettings';
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef'), FriendUserRef : friendRef , ShareLocation : toggle});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(determineMyLocationShareOrNotUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // update user location
    updateUserLocation(longtitute, latitude){
        
        var updateUserLocationUrl = REMOTE_URL + 'api/UserLocation';
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef'), Longitute : longtitute , Latitude : latitude});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(updateUserLocationUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get user location
    getUserLocation(){

        var getUserLocationUrl = REMOTE_URL + 'api/UserLocation' + '?UserRef=' +  localStorage.getItem('userRef');
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getUserLocationUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get friend's location
    getFriendLocation(friendRef){

        var getFriendLocationUrl = REMOTE_URL + 'api/UserLocation' + '?UserRef=' +  friendRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getFriendLocationUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // send the follow request to others
    sendRequestToFollow(userRef, duration){
        
        var sendRequestToFollowUrl = REMOTE_URL + 'api/SendFoLowRequest';
        var data1 = JSON.stringify({FromUserRef : localStorage.getItem('userRef'), ToUserRef : userRef, TimeOut: duration});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(sendRequestToFollowUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // accept the follow request from others
    acceptFollowRequest(Request_Ref,From_UserRef){
        
        var acceptFollowRequestUrl = REMOTE_URL + 'api/followSession';
        var data1 = JSON.stringify({RequestRef : Request_Ref, RequesterUserRef : From_UserRef, RecieverUserRef: localStorage.getItem('userRef')});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(acceptFollowRequestUrl,data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get all active and archived session list
    getSession(){
        
        var getSessionUrl = REMOTE_URL + 'api/followSession' + '?UserRef=' + localStorage.getItem('userRef') + '&Start=1&End=10';
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getSessionUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get session info like location change with time in detail
    getSessionInfoInDetail(requestRef){
        
        var getSessionInfoInDetailUrl = REMOTE_URL + 'api/FoLowSessionDetail' + '?RequestRef=' + requestRef + '&RequesterUserRef=' + localStorage.getItem('userRef');
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getSessionInfoInDetailUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // end all active sessions
    endRequestToFollowByStarter(requestRef){
        
        var endRequestToFollowByStarterUrl = REMOTE_URL + 'api/FolowSessionEnd';
        var data1 = JSON.stringify({requestRef : requestRef})
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(endRequestToFollowByStarterUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // end active session for individual
    endSessionForIndividual(requestRef){
        
        var endSessionForIndividualUrl = REMOTE_URL + 'api/FolowSessionEnd';
        var data1 = JSON.stringify({requestRef : requestRef , RequesterUserRef : localStorage.getItem('userRef')})
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Put", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.put(endSessionForIndividualUrl, data1,Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // delete session from archived session list
    deleteFollowSession(requestRef){
        var deleteFollowSessionUrl = REMOTE_URL + 'api/followSession';
        var data1 = JSON.stringify({requestRef : requestRef , RequesterUserRef : localStorage.getItem('userRef')})
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Delete", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header , body : data1});
        return this.http.delete(deleteFollowSessionUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // save map image that captured when session end
    saveSessionImage(requestRef,image){
        
        var saveSessionImageUrl = REMOTE_URL + 'api/SessionImage';
        var data1 = JSON.stringify({requestRef : requestRef , Image : image});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(saveSessionImageUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get map image that captured when session end
    getSessionImage(requestRef){
        
        var getSessionImageUrl = REMOTE_URL + 'api/SessionImage' + '?RequestRef=' + requestRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getSessionImageUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    //get user's profile pic
    getProfilePic(){
        
        var getProfilePicUrl = REMOTE_URL + 'api/GetProfilePicture' + '?userRef=' + localStorage.getItem('userRef');
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getProfilePicUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    //get friend's profile pic
    getFriendProfilePic(friendRef){
        
        var getProfilePicUrl = REMOTE_URL + 'api/GetProfilePicture' + '?userRef=' + friendRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getProfilePicUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // get the value that will be displayed on dashboard
    getDashboardValue(){
        
        var getDashboardValueUrl = REMOTE_URL + 'api/Dashboard' + '?userRef=' + localStorage.getItem('userRef');
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(getDashboardValueUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // save map image that captured when session end
    facebookFriend(fbFriend){
        
        var fbFriendUrl = REMOTE_URL + 'api/fbUser';
        var data1 = JSON.stringify({UserRef : localStorage.getItem('userRef') , FBID : fbFriend});
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Post", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.post(fbFriendUrl, data1, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

    // extend the session time
    extendSessionTime(requestRef){
        
        var extendTimeUrl = REMOTE_URL + 'api/ExtendTimeOut?RequestRef=' + requestRef;
        let Header = new Headers({ "Content-Type": "application/json", "Method":"Get", "Authorization": Authorization});
        let Option = new  RequestOptions({ headers: Header});
        return this.http.get(extendTimeUrl, Option)
            .toPromise().
            then (response => {
                return response.json();
            })
            .catch(err =>{ return '-1'});
    }

}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { Events } from 'ionic-angular';
//import { Http } from '@angular/http';
import { AuthService } from './authService.provider';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { mapboxApiKey} from '../app/app.config';
@Injectable()
export class MapboxService {

    currentUrl = 'assets/img/current.png';
    routeColor:any[] = ["#FD0606","#FD06E9","#8C06FD","#06D8FD","#06FD23","#FDFB06","#070606","#C67D6F","#D2CDE9","#FD9500"]; 
    profilePicture:any;
  /*
    map container in main page
    mockup-10page
  */
    sessionMap = {
      map: null,
      currentMarker: null,
      userMarkerArray: [],
      directionArray: [],
      routeArray: [],
      updateIndex: 0
    };
    /*
      usermap in user map page
    */
    userMap = {
      map: null
    };
    constructor(
        private http: Http,
        private auth: AuthService) {
        mapboxgl.accessToken = mapboxApiKey;
    };
  /*
    Add current user marker to the map
    @parameter
      _map: object(map instance)
      _current: array(lngLat of current user)
    @return
      marker
  */
    addCurrentMarker = function(_map, _current){
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'current-marker';
        var img = document.createElement('img');
        img.className = 'current-img';
        img.src = this.currentUrl;
        el.appendChild(img);
        // add marker to map
        var currentMarker = new mapboxgl.Marker(el, {offset: [0, 0]})
            .setLngLat([_current[0], _current[1]])
            .addTo(_map);
        return currentMarker;
    };
  /*
    get directions between two coordinates
    @parameter
      _startLon, _startLat, _endLon, _endLat
  */
  getDirections(_startLon, _startLat, _endLon, _endLat, _step) {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.mapbox.com/directions/v5/mapbox/driving/' + _startLon + ',' + _startLat + ';' + _endLon + ',' + _endLat + '?geometries=geojson&overview=full&steps=true&access_token=' + mapboxApiKey).subscribe((res) => {
        let response = res.json();
        resolve(response);
      }, (err) => {
        reject('get direction error');
      });
    });
  };
  /*
    Add route layer to the map and fit bound to padding
    @parameter
      _id: number(routeId)
      _map: object(map to add route layer)
      _direction: object(directions data from server)
      _padding: object(fit route map padding size)
      _color: string(routeColor #ffffff)
      _flag: boolean(whether fit bound or not)
  */
  addRoute(_id, _map, _coordinates, _padding, _color, _flag){
    var routeId = _id;
     // Geographic coordinates of the LineString
    _map.addLayer({
          "id": routeId,
          "type": "line",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                      "type": "LineString",
                      "coordinates": _coordinates
                  }
              }
          },
          "layout": {
              "line-join": "round",
              "line-cap": "round"
          },
          "paint": {
              "line-color": _color,
              "line-width": {"base": 5, "stops": [[12, 5], [13, 5], [14, 10], [20, 15]]}
          }
      }, 'road_label');
        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        if(_flag == true){
          var bounds = _coordinates.reduce(function(bounds, coord) {
              return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(_coordinates[0], _coordinates[0]));
          _map.fitBounds(bounds, {
              padding: _padding
          });
        }
  };
  /*
    Add user markers to the map
    @parameter
      _map: object(map instance)
      _users: array(lngLat array of users)
      _mode: 'driver', 'drifter'
      _title: 
        null-> show nickname below user icon
        'distance'->show distance below user icon
    @return
      markerarray
  */
  addUserMarkers(_map:any, _users:Array<any>, _currentPos:any) {
    var _userMarkerArray = [];
    var index = 1;
    // add user markers to map
    _users.forEach((_user) =>{
        if(_user.UserRef != localStorage.getItem('userRef')){
              this.auth.getUserInfo(_user.UserRef)
              .then(data=>{
                var profilePicture = data.ProfilePicture;
              
            // create a DOM element for the marker
              var el = document.createElement('div');
              el.className = 'user-marker';
              var img = document.createElement('img');
                img.className = 'user-img';
                img.src = 'assets/img/' + index + '.png';
                el.appendChild(img);
              var img1 = document.createElement('img');
                img1.className = "user-profile-img";
                //img1.src = "assets/img/man.png";
                img1.src = profilePicture;
                el.appendChild(img1);
              // add marker to map
              var userMarker = new mapboxgl.Marker(el, {offset: [0, 0]})
                  .setLngLat([_user.locationDetails[_user.locationDetails.length-1].Logitude, _user.locationDetails[_user.locationDetails.length-1].Latitude])
                  .addTo(_map);
              _userMarkerArray.push(userMarker);
              index++;
              })
        }
    });
    return _userMarkerArray;
  };
  /*
    Add directions between current user and session followers
  */
  addDirections(_map: any, _users: Array<any>, _currentPos:any){
    var _directionArray = [];
    // add user markers to map
    _users.forEach((_user) =>{
        if(_user.UserRef != localStorage.getItem('userRef')){
          this.getDirections(_currentPos[0], _currentPos[1], _user.locationDetails[_user.locationDetails.length-1].Logitude, _user.locationDetails[_user.locationDetails.length-1].Latitude, true).then((res: any) => {
              var coordinates = res.routes[0].geometry.coordinates;
              this.addRoute('direction' + this.sessionMap.updateIndex + _user.UserRef, _map, coordinates, 0, '#0000ff', false);
              _directionArray.push('direction' + this.sessionMap.updateIndex + _user.UserRef);
          });
        }
    });
    return _directionArray;
  };
  /*
    Add routes user's
  */
  addRoutes(_map: any, _users: Array<any>, _currentPos:any){
    var _routeArray = [];
    var i = 0;
    // add user markers to map
    _users.forEach((_user) =>{
        if(_user.UserRef != localStorage.getItem('userRef')){
          var coordinates=[];
          _user.locationDetails.forEach((_location:any) => {
            coordinates.push([_location.Logitude, _location.Latitude]);
          });
          this.addRoute('route' + this.sessionMap.updateIndex + _user.UserRef, _map, coordinates, 0, this.routeColor[i], false);
          _routeArray.push('route' + this.sessionMap.updateIndex + _user.UserRef);
          i++;
        }
    });
    return _routeArray;
  };
    /*
        show map to select driver destination 
    */
    showSessionMap(_mapUpdate, _mapOptions, _dataOptions){
        return new Promise((resolve, reject) => {
            if(_mapUpdate == false){
                let map = new mapboxgl.Map(_mapOptions);
                this.sessionMap.map = map;
                this.sessionMap.map.on('load', () => {
                  this.sessionMap.currentMarker = this.addCurrentMarker(this.sessionMap.map, [_dataOptions.currentlon, _dataOptions.currentlat]);
                  resolve('map loaded successfully');
                });
            }else{
                if(this.sessionMap.userMarkerArray.length > 0)
                  this.sessionMap.userMarkerArray.forEach((umarker) => {umarker.remove()});
                if(this.sessionMap.directionArray.length > 0)
                  this.sessionMap.directionArray.forEach((direction) => this.sessionMap.map.removeLayer(direction));
                if(this.sessionMap.routeArray.length > 0)
                  this.sessionMap.routeArray.forEach((route) => this.sessionMap.map.removeLayer(route));
                this.sessionMap.updateIndex++;
                if(_dataOptions.detail)
                {
                  this.sessionMap.userMarkerArray = this.addUserMarkers(this.sessionMap.map, _dataOptions.detail, [_dataOptions.currentlon, _dataOptions.currentlat]);
                  this.sessionMap.directionArray = this.addDirections(this.sessionMap.map, _dataOptions.detail, [_dataOptions.currentlon, _dataOptions.currentlat]);
                  this.sessionMap.routeArray = this.addRoutes(this.sessionMap.map, _dataOptions.detail, [_dataOptions.currentlon, _dataOptions.currentlat]);
                  //console.log(this.sessionMap);
                }
                resolve('update otherusers successfully!');
            }
        });    
    };
    /*
      show user map
    */
    showUserMap(_mapOptions) {
      let map = new mapboxgl.Map(_mapOptions);
      this.userMap.map = map;
      this.userMap.map.on('load', () => {
        this.addCurrentMarker(this.userMap.map, _mapOptions.center);
      });
    };

    
    distance(lat1, lon1, lat2, lon2) 
    {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        return dist;
    }
}
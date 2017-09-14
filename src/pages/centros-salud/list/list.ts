import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GoogleMapsProvider } from "../../../providers/google-maps/google-maps";

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {

  points: any[];
  position: any = {};
  lugares: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: LocationsProvider,
    public gMaps: GoogleMapsProvider) {
  }

  ionViewDidLoad() {
    Promise.all([
      this.locations.get().then(data => {
        this.points = Array.of(data);
        return Promise.resolve(data);
      }).catch(error => console.log("ERROR LISTS___>", error)),
      this.gMaps.getGeolocation()
    ]).then(result => {
      this.position = result[1];
      this.applyHaversine({ lat: this.position.coords.latitude, lng: this.position.coords.longitude });
    }).catch(error => console.log("ERROR2 LISTS___>", error));

  }

  //Fórmula para calcular la distancia entre dos puntos sabiendo latitud y longitud
  applyHaversine(userLocation) {

    for (var i = 0; i < this.points[0].length; i++) {
      let placeLocation = {
        lat: this.points[0][i].coordenadasDeMapa.latitud,
        lng: this.points[0][i].coordenadasDeMapa.longitud
      };
      debugger;
      this.points[0][i].distance = this.gMaps.getDistanceBetweenPoints(
        userLocation,
        placeLocation,
        'km'
      ).toFixed(2);


      this.points[0].sort((locationA, locationB) => {
        //debugger;
        return locationA.distance - locationB.distance;
      });

      this.lugares = this.points[0];
    }
    // this.points.map((location, i) => {

    //   let placeLocation = {
    //     lat: location[i].coordenadasDeMapa.latitud,
    //     lng: location[i].coordenadasDeMapa.longitud
    //   };
    //   debugger;
    //   location[i].distance = this.gMaps.getDistanceBetweenPoints(
    //     userLocation,
    //     placeLocation,
    //     'km'
    //   ).toFixed(2);

    //       this.points.sort((locationA, locationB) => {
    // debugger;
    //         return locationA.distance - locationB.distance;
    //       });
    //});

    // this.points.map((location) => {

    //   let placeLocation = {
    //     lat: location.latitude,
    //     lng: location.longitude
    //   };

    //   location.distance = this.gMaps.getDistanceBetweenPoints(
    //     userLocation,
    //     placeLocation,
    //     'km'
    //   ).toFixed(2);

    //   this.points.sort((locationA, locationB) => {

    //     return locationA.distance - locationB.distance;
    //   });

    // });


  }

}

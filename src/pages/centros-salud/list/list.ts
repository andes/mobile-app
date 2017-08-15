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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: LocationsProvider,
    public gMaps: GoogleMapsProvider) {
  }

  ionViewDidLoad() {
    Promise.all([
      this.locations.load().then(data => {
        this.points = data;
        return Promise.resolve(data);
      }),
      this.gMaps.getGeolocation()
    ]).then(result => {
      let position = result[1];
      this.applyHaversine({ lat: position.coords.latitude, lng: position.coords.longitude });
    });

  }

  //Fórmula para calcular la distancia entre dos puntos sabiendo latitud y longitud
  applyHaversine(userLocation) {

    this.points.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.gMaps.getDistanceBetweenPoints(
        userLocation,
        placeLocation,
        'km'
      ).toFixed(2);

      this.points.sort((locationA, locationB) => {
        return locationA.distance - locationB.distance;
      });

    });


  }

}

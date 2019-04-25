import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationsProvider } from '../../../../providers/locations/locations';
import { GeoProvider } from '../../../../providers/geo-provider';
import { MapPage } from '../map/map';


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
        public gMaps: GeoProvider) {
    }

    ionViewDidLoad() {
        this.locations.getV2().subscribe(result => {
            this.points = (result as any[]).filter(unCentro => unCentro.showMapa === true);
            if (this.gMaps.actualPosition) {
                this.applyHaversine({ lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude });
                this.points = this.points.slice(0, 5);
            } else {
                this.gMaps.getGeolocation().then(position => {
                    this.applyHaversine({ lat: position.coords.latitude, lng: position.coords.longitude });
                    this.points = this.points.slice(0, 5);
                })
            }
        });
    }

    applyHaversine(userLocation) {
        for (let i = 0; i < this.points.length; i++) {
            let placeLocation = {
                lat: this.points[i].direccion.geoReferencia[0],
                lng: this.points[i].direccion.geoReferencia[1]
            };

            this.points[i].distance = this.gMaps.getDistanceBetweenPoints(
                userLocation,
                placeLocation,
                'km'
            ).toFixed(2);

            this.points.sort((locationA, locationB) => {
                return locationA.distance - locationB.distance;
            });
        }
    }

    private navigateTo(location) {
        window.open('geo:?q=' + location[0] + ',' + location[1]);
    }

    toMap(centro) {
        this.navigateTo(centro.direccion.geoReferencia);
    }

}

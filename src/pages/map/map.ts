import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocationsProvider } from '../../providers/locations/locations';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';


/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public maps: GoogleMapsProvider,
    public platform: Platform, public locations: LocationsProvider) {
  }

  ionViewDidLoad() {
    // this.platform.ready().then(() => {
    //   let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
    // });
    this.platform.ready().then(() => {

      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      let locationsLoaded = this.locations.load();

      Promise.all([
        mapLoaded,
        locationsLoaded
      ]).then((result) => {

        let locations = result[1];

        for (let location of locations) {
          this.maps.addMarker(location.latitude, location.longitude);
        }

      });

    });
  }

}

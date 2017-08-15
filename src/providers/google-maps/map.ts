declare var google;
import { Geolocation } from 'ionic-native';

export class Map {
  mapElement: any;
  pleaseConnectElement: any;
  mapObject: any;
  markers: any[] = [];

  constructor(mapElement: any, pleaseConnect: any) {
    this.mapElement = mapElement;
    this.pleaseConnectElement = pleaseConnect;

    let latLng = new google.maps.LatLng(-38.951625, -68.060341);
    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.mapObject = new google.maps.Map(this.mapElement, mapOptions);
    this.enableMap();
  }


  public addMarker(location: any): void {
    let latLng = new google.maps.LatLng(location.latitude, location.longitude);

    let marker = new google.maps.Marker({
      map: this.mapObject,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: location.title,
      icon: location.image
    });

    if (marker.title) {
      var infoWindowContent = '<div id="content"><h2 id="firstHeading" class="firstHeading">' + marker.title + '</h2></div>';
      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });

      marker.addListener('click', () => {
        infoWindow.open(this.mapObject, marker);
      });
    }

    this.markers.push(marker);
    return marker;
  }

  disableMap(): void {
    if (this.pleaseConnectElement) {
      this.pleaseConnectElement.style.display = "block";
    }
  }

  enableMap(): void {
    if (this.pleaseConnectElement) {
      this.pleaseConnectElement.style.display = "none";
    }
  }

}

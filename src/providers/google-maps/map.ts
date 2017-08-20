declare var google;
import { Geolocation } from 'ionic-native';

export class Map {
  mapElement: any;
  pleaseConnectElement: any;
  mapObject: any;
  markers: any[] = [];

  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;

  constructor(mapElement: any, pleaseConnect: any) {
    this.mapElement = mapElement;
    this.pleaseConnectElement = pleaseConnect;

    let latLng = new google.maps.LatLng(-38.951625, -68.060341);
    this.myLatLng = { lat: -38.951625, lng: -68.060341 };

    let mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.mapObject = new google.maps.Map(this.mapElement, mapOptions);
    this.enableMap();

    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();
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

  showRoute(panelElement: any) {
    this.directionsDisplay.setMap(this.mapObject);
    this.directionsDisplay.setPanel(panelElement);

    google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
      // mapElement.classList.add('show-map');
      this.calculateRoute();
    });
  }

  private calculateRoute() {    
    this.bounds.extend(this.myLatLng);

    this.mapObject.fitBounds(this.bounds);

    this.directionsService.route({
      origin: new google.maps.LatLng(-38.951024, -68.055979),
      destination: new google.maps.LatLng(this.myLatLng),      
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

}

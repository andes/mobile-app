declare var google;
import { Geolocation } from 'ionic-native';

export class Map {
  mapElement: any;
  panelElement: any;
  pleaseConnectElement: any;
  mapObject: any;
  markers: any[] = [];

  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;

  constructor(mapElement: any, panelElement: any, pleaseConnect: any) {
    this.mapElement = mapElement;
    this.pleaseConnectElement = pleaseConnect;
    this.panelElement = panelElement;

    let latLng = new google.maps.LatLng(-38.951625, -68.060341);

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
      var infoWindowContent = document.createElement('div');
      infoWindowContent.innerHTML = '<span style="color: grey; font-size:16px;font-weight: 900;">' + marker.title + '</span></br>' +
        '<span style="color: grey; font-size:12px;font-weight: 900;">' + location.address + '</span></br>' +
        '<a id="idRuta">Ver Ruta --></a>';

      var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 400
      });

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('idRuta').addEventListener('click', () => {
          let pos2 = {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
          }
          let pos1 = this.myLatLng;
          this.showRoute(pos1, pos2);
        });
      });

      marker.addListener('click', () => {
        infoWindow.open(this.mapObject, marker);
      });
    }

    this.markers.push(marker);
    return marker;
  }

  public miPosicion(miPosicion: any) {
    return this.myLatLng = { lat: miPosicion.coords.latitude, lng: miPosicion.coords.longitude };
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

  public showRoute(start, end) {
    this.directionsDisplay.setMap(this.mapObject);
    this.directionsDisplay.setPanel(this.panelElement);

    this.calculateRoute(start, end);
  }

  private calculateRoute(position1, position2) {
    // this.bounds.extend(this.myLatLng);

    this.mapObject.fitBounds(this.bounds);
    this.directionsService.route({
      origin: new google.maps.LatLng(position1.latitude, position1.longitude),
      destination: new google.maps.LatLng(position2.lat, position2.lng),
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

}

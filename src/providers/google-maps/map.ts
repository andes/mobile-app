declare var google;
// import { Geolocation } from 'ionic-native';

export class Map {
    mapElement: any;
    // panelElement: any;
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
        // this.panelElement = panelElement;

        let latLng = new google.maps.LatLng(-38.951625, -68.060341);
        let mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false
        }

        this.mapObject = new google.maps.Map(this.mapElement, mapOptions);
        this.enableMap();

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.bounds = new google.maps.LatLngBounds();
    }

    public deleteAllMarkers() {
        let total = this.markers.length;
        for (let i = 0; i < total; i++) {
            this.markers[i].setMap(null);
        }

        this.markers = [];
    }

    public addMarker(location: any, options: any): void {
        let latLng = new google.maps.LatLng(location.latitude, location.longitude);

        let marker = new google.maps.Marker({
            map: this.mapObject,
            animation: google.maps.Animation.DROP,
            position: latLng,
            title: location.title,
            icon: location.image,
            draggable: (options && options.draggable) ? true : false
        });

        if (marker.title) {
            var infoWindowContent = document.createElement('div');
            infoWindowContent.innerHTML = '<span style="color: grey; font-size:16px;font-weight: 900;">' + marker.title + '</span></br>' +
                '<span style="color: grey; font-size:12px;font-weight: 900;">' + location.address + '</span></br>' +
                '<a id="idRuta' + location.index + '">¿Cómo llegar?</a>';

            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent,
                maxWidth: 400
            });

            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                document.getElementById('idRuta' + location.index).addEventListener('click', () => {
                    let pos = {
                        lat: marker.getPosition().lat(),
                        lng: marker.getPosition().lng()
                    }
                    if (this.myLatLng) {
                        this.showRoute(pos);
                    }
                });
            });

            if (location.centroSeleccionado) {
                infoWindow.open(this.mapObject, marker);
                marker.setAnimation(google.maps.Animation.BOUNCE)
            } else {
                marker.addListener('click', () => {
                    infoWindow.open(this.mapObject, marker);
                });
            }

            if (marker.draggable) {
                google.maps.event.addListener(marker, 'dragend', function () {
                    // TODO: Return new lat lang
                    console.log(marker);
                });
            }
        }

        this.markers.push(marker);
        return marker;
    }

    public miPosicion(miPosicion: any) {
        this.myLatLng = { lat: parseFloat(miPosicion.coords.latitude), lng: parseFloat(miPosicion.coords.longitude) };
        return this.myLatLng
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

    showRoute(position) {
        this.directionsDisplay.setMap(this.mapObject);
        this.calculateRoute(position);
    }

    private calculateRoute(position) {
        this.bounds.extend(this.myLatLng);
        this.mapObject.fitBounds(this.bounds);
        this.directionsService.route({
            origin: new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
            destination: new google.maps.LatLng(position.lat, position.lng),
            travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
            } else {
                alert('Could not display directions due to: ' + status);
            }
        });
    }

}

// Config file for Maps

const defaultMapZoom = 17

const defaultMapProps = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "landscape.man_made",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "landscape.natural",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.attraction",
          "elementType": "labels.icon",
          "stylers": [{"color": "#ff8040"}]
        },
        {
          "featureType": "poi.business",
          "elementType": "geometry",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.government",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.medical",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.park",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.place_of_worship",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.school",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.sports_complex",
          "stylers": [{"visibility": "off"}]
        }
    ]
}

const nightMapProps = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
    ]
}

export {
    defaultMapZoom,
    defaultMapProps,
    nightMapProps
}
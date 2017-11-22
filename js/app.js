// Create a new blank array for all the listing markers.
var markers = [];

//Wrapper class for location data
var Location = function(data){
    this.title = data.title;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.id = data.id;
};

var map;

function initMap() {
    // Create a styles array to use with the map.
    var styles = [
    {
        featureType: 'water',
        stylers: [
        { color: '#19a0d8' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
        { color: '#ffffff' },
        { weight: 6 }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
        { color: '#e85113' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
        ]
    },
    {
        featureType: 'transit.station',
        stylers: [
        { weight: 9 },
        { hue: '#e85113' }
        ]
    },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
        { visibility: 'off' }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
        { lightness: 100 }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
        { lightness: -100 }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
        ]
    }
    ];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.6170044, lng: -122.2725621},
        zoom: 10,
        styles: styles,
        mapTypeControl: false
    });

    ko.applyBindings(new ViewModel());
}

function ViewModel() {
    var self = this;

    //filter value is bound to textArea
    self.filter = ko.observable("");
    self.locationList = ko.observableArray([]);
  
    //populating locationList with locations from model.js
    locations.forEach(function(location){
        self.locationList.push(new Location(location));
    });

    //one infoWindow is used for handling all game stores
    var infoWindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    // var defaultIcon = makeMarkerIcon('0091ff');
    var defaultIcon = {
        url: 'images/bluedie.png',
        //size: new google.maps.Size(34, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(64,64)
        };

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    //var highlightedIcon = makeMarkerIcon('FFFF24');
    var highlightedIcon = {
        url: 'images/orangedie.png',
        //size: new google.maps.Size(34, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(64,64)
        };

    //creating markers for each location
    self.locationList().forEach(function(location){
        var position = new google.maps.LatLng(location.lat, location.lng);
        var title = location.title;
        var id = location.id;
        var marker = new google.maps.Marker({
            map:map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: id
        });

        //add marker to markers array
        location.marker = marker;
        markers.push(marker);

        //add on click listener for markers
        marker.addListener('click', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                marker.setAnimation(null);
            }, 1400);

            populateInfoWindow(this, infoWindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        //a function that triggers a click on a marker, called on click in list
        self.triggerClick = function() {
            google.maps.event.trigger(this.marker, 'click');
        };
    });

    self.filteredLocationList = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        //if nothing has been entered into the text bar, set every marker visible
        if (!filter) {
            self.locationList().forEach(function(location) {
                location.marker.setVisible(true);
            });
            return self.locationList();


        } else {
            if (infoWindow.marker !== undefined){
                //close the info window if its marker doesn't pass the filter
                if (infoWindow.marker.title.indexOf(filter) !== 0){
                    infoWindow.close();
                }
            }
            return ko.utils.arrayFilter(self.locationList(), function(location) {
                var startsWith = stringStartsWith(location.title.toLowerCase(), filter);
                location.marker.setVisible(startsWith);
                return startsWith;
            });
        }
    }, self);

    self.offScreen = ko.observable(false);

    self.toggle = function(){
        self.offScreen(!self.offScreen());
    };

    var stringStartsWith = function (string, startsWith) {
        string = string || "";
        return string.substring(0, startsWith.length) === startsWith;
    };
}

// This function populates the infoWindow when the marker is clicked. We'll only allow
// one infoWindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infoWindow) {
    // Check to make sure the infoWindow is not already opened on this marker.
    //if (infoWindow.marker != marker) {
    infoWindow.marker = marker;

    $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + marker.id 
        + "/tips?client_id=BA1MA3SBGKLKEFZKBYVAR0C2FPWY3D31OJ5R0XY5W1OE0K5C&"
        + "client_secret=IHD1D3YYKVPLDAEVXR05HGYLBWM12ADYFFBOIAYUS5GVJZEF&v=20170810",
        dataType: "jsonp"
    })

    .done(function(results){
        console.log(results.response);
        if (results.response.tips.items[0]){
            var tip = results.response.tips.items[0].text;
            infoWindow.setContent('<div>' + marker.title 
        	   + '</div><br><div>Top tip: ' + tip + '</div>');
        }

        else {
            infoWindow.setContent('<div>' + marker.title + '</div><br><div>No tips available</div>');
        }

    })

    .fail(function(){
        infoWindow.setContent('<div>' + marker.title + '</div><br><div>could not load tip</div>');
    }); 

    infoWindow.open(map, marker);
    // Make sure the marker property is cleared if the infoWindow is closed.
    infoWindow.addListener('closeclick', function() {
    //infoWindow.marker = null;
    });
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

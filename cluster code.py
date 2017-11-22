//The code below is commented out currently. It will eventually be incorporated into the project.

  // var clusterOptions = {gridSize: 50, maxZoom: 15};
  // var markerCluster = new MarkerClusterer(map, markers, 
  //   {imagePath: 'images/m'});


  // The following group uses the location array to create an array of markers on initialize.

  
  /*for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map:map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: id
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }*/

  // document.getElementById('show-listings').addEventListener('click', showListings);
  // document.getElementById('hide-listings').addEventListener('click', hideListings);
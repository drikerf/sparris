// Globals
var places = null;
var counter = 0;
// Main js
$(function () {
    // Geolocate
    getLocation();

    // Handle user choice
    // Okey button
    $('.okeyBtn').on('click', function () {
        // Hide okey button
        $('.okeyBtn').hide();
        // Contruct map url
        var mapUrl = 'https://maps.google.com/?q=loc:' + 
        places[counter].coords.lat + ',' +
        places[counter].coords.lon;
        // Begin html output
        var htmlOutput = '<p>';
        // Show address, map and share button
        if (places[counter].address) {
            htmlOutput += '<strong>' + places[counter].address +
                '</strong><br />';
        }
        htmlOutput += '<a href="' + mapUrl + '" target="_blank">(Map)</a>';
        htmlOutput += '</p>'
        
        // Write html
        $('.placeInfo').append(htmlOutput);

    });

    // Nope button
    $('.nopeBtn').on('click', function () {
        // Show okey button
        $('.okeyBtn').show();
        // If all sights are gone through, start over
        if (counter+1 > places.length-1) {
            return;
        }

        // Increment nopeCounter
        counter++;

        // Show next sight
        writeDOM(places[counter]);
    });
});

// Geolocate user
function getLocation () {
    // Show loader
    $('.modal').show();
    // Get geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = {'lat': position.coords.latitude,
                'lon': position.coords.longitude};
            getPlaces(coords);
        });
    // Not supported
    } else {
        $('.placeInfo').append('Geolocation is not supported');
    }
}

// Get places from api
function getPlaces (coords) {
    // Make ajax request
    $.ajax({
        url: '/api/places',
        data: coords,
        success: updatePlace,
        dataType: 'json'
    });
}

// Get place callback
function updatePlace (data) {
    // Hide loader
    $('.modal').hide();
    // Shuffle places
    data = shufflePlaces(data);

    // Set global places
    places = data;
    // Write DOM
    writeDOM(data[0]);
    // TODO: Add html with place details.
    // Okey links to specifics, map button and share button.
    // Nope Gets next place in data
}

// Shuffle places
function shufflePlaces (places) {
    var counter = places.length, temp, index;

    // While elements in array
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter --;
        // swap last element with element
        temp = places[counter];
        places[counter] = places[index];
        places[index] = temp;
    }
    return places;
}

// Write place to dom
function writeDOM (place) {
    // construct html
    var placeOutput = '<img class="img-circle" src="' + place.photo + '" />' +
        '<h2><a href="' + place.url + '" target="_blank">' + place.name + '</a></h2>';
    if (place.tip) {
        placeOutput += '<p>"' + place.tip +'"</p>';
    }
    $('.placeInfo').html(placeOutput);
}



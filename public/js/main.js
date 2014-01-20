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

        // Increment counter
        counter++;

        // Show next sight
        writeDOM(places[counter]);
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// Geolocate user
function getLocation() {
    // Show loader
    $('.placeInfo').html('<h2>Finding places near your location...</h2>');
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
function getPlaces(coords) {
    // Make ajax request
    $.ajax({
        url: '/api/places',
        data: coords,
        success: updatePlace,
        contentType: 'json; charset=utf-8'
    });
}

// Get place callback
function updatePlace(data) {
    // If nothing, write error
    if (data == null) {
        showError();
        return;
    }
    // Shuffle places
    data = shufflePlaces(data);
    // Set global places
    places = data;
    // Set nope counter to 0
    counter = 0;
    // Write DOM
    writeDOM(data[0]);
}

function showError() {
    $('.placeInfo').html('<h2>Nothing found :(</h2>');
}

// Shuffle places
function shufflePlaces(places) {
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
function writeDOM(place) {
    // construct html
    var placeOutput = '<img class="img-circle imgCenter" src="' + place.photo + '" />' +
        '<h2><a href="' + place.url + '" target="_blank">' + place.name + '</a></h2>';
        placeOutput += '<p>"' + place.description +'"</p>';
    $('.placeInfo').html(placeOutput);
}



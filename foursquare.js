// Http
var https = require('https');

// API Keys
var api_keys = require('./api_keys.js');

exports.getPlaces = function (coords, callback) {
    // Placeholder
    var places = null;
    // Construct url
    var version = '20130815';
    var section = 'sights';
    var category = 
        // Historic sights
        '4deefb944765f83613cdba6e,' +
        // General entertainment
        '4bf58dd8d48988d18e941735,' +
        // Museum
        '4bf58dd8d48988d181941735,' +
        // Pool hall
        '4bf58dd8d48988d1e3931735,' +
        // Theme park
        //'4bf58dd8d48988d182941735,' +
        // Zoo
        '4bf58dd8d48988d17b941735,' +
        // Outdoors and recreation
        //'4d4b7105d754a06377d81259,' +
        // Beach
        //'4bf58dd8d48988d1e2941735,' +
        // Castle
        '50aaa49e4b90af0d42d5de11'
        // Harbor Marina
        //'4bf58dd8d48988d1e0941735,' +
        // Mountain
        //'4eb1d4d54b900d56c88a45fc,' +
        // Other great outdoors
        //'4bf58dd8d48988d162941735,' +
        // Park
        //'4bf58dd8d48988d163941735,' +
        // Scenic lookout
        //'4bf58dd8d48988d165941735,' +
        // Pier
        //'4e74f6cabd41c4836eac4c31'
        ;
    var img_size = '300x300'
    var url = 'https://api.foursquare.com/v2/venues/explore' +
        '?client_id=' + api_keys.fs.CLIENT_ID + 
        '&client_secret=' + api_keys.fs.CLIENT_SECRET + 
        '&v=' + version + 
        '&ll=' + coords.lat + ',' + coords.lon + 
        '&categoryId=' + category + 
        '&venuePhotos=1' +
        '&sortByDistance=1' +
        '&limit=50';
    // Get json from foursquare
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var foursquareResponse = JSON.parse(body);
            var places = new Array();
            // Iterate items and create objects
            // Try
            try {
                foursquareResponse.response.groups[0].items.forEach(function (item) {
                    var place = {};
                    place.name = item.venue.name;
                    place.address = item.venue.location.address;
                    place.postalCode = item.venue.location.postalCode;
                    place.coords = {'lat': null, 'lon': null};
                    place.coords.lat = item.venue.location.lat;
                    place.coords.lon = item.venue.location.lng;
                    place.url = 'http://foursquare.com/v/'+item.venue.id;

                    if (item.venue.photos.groups[0]) {
                        if (item.venue.photos.groups[0].items) {
                            place.photo = item.venue.photos.groups[0].items[0].prefix +
                                img_size + item.venue.photos.groups[0].items[0].suffix;
                        }
                    }
                    // Look for tips
                    if (item.tips) {
                        // TODO: Randomly pick a tip / pick best tip?
                        place.tip = item.tips[0].text;
                    }
                    places.push(place);
                });
                callback(places, null);
            } catch (error) {
                // Do nothing..
            }
        });
    }).on('error', function (error) {
        console.log('Got error: ', error);
    });
};



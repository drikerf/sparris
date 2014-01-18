// Http
var https = require('https');

// Local dev API Keys
try {
    var api_keys = require('./api_keys.js');
} catch (error) {
    // nothing
}
exports.getPlaces = function (coords, callback) {
    // Places
    var places = new Array();
    // Url parameters
    var version = '20130815';
    // Categories TODO: optimize query/categories
    var category = 
        // Historic sights
        '4deefb944765f83613cdba6e,' +
        // General entertainment
        '4bf58dd8d48988d18e941735,' +
        // Bowling alley
        '4bf58dd8d48988d1e4931735,' +
        // Museum
        '4bf58dd8d48988d181941735,' +
        // Pool hall
        '4bf58dd8d48988d1e3931735,' +
        // Public art
        '507c8c4091d498d9fc8c67a9,' +
        // Beaches
        '4bf58dd8d48988d1e2941735,' +
        // Mountain
        '4eb1d4d54b900d56c88a45fc,' +
        // Parks
        '4bf58dd8d48988d163941735,' +
        // Outher great outdoors
        '4bf58dd8d48988d162941735,' +
        // Zoo
        '4bf58dd8d48988d17b941735,' +
        // Castle
        '50aaa49e4b90af0d42d5de11'
        ;
    var img_size = '300x300'
    // Get API keys from env or local
    var client_id = process.env.CLIENT_ID || api_keys.fs.CLIENT_ID;
    var client_secret = process.env.CLIENT_SECRET || api_keys.fs.CLIENT_SECRET;
    var url = 'https://api.foursquare.com/v2/venues/explore' +
        '?client_id=' + client_id + 
        '&client_secret=' + client_secret + 
        '&v=' + version + 
        '&ll=' + coords.lat + ',' + coords.lon + 
        '&categoryId=' + category + 
        '&venuePhotos=1';
    // Get json
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            try {
                var foursquareResponse = JSON.parse(body);
                var items = foursquareResponse.response.groups[0].items;
                var itemsLength = items.length;
                var placeCounter = 0;
                // Loop
                items.forEach(function (item) {
                    var detailUrl = 'https://api.foursquare.com/v2/venues/' + item.venue.id +
                    '/' + '?client_id=' + client_id + '&client_secret=' + client_secret;
                    https.get(detailUrl, function (res) {
                        var body = '';
                        res.on('data', function (chunk) {
                            body += chunk;
                        });
                        res.on('end', function () {
                            var place = {};
                            var response = JSON.parse(body).response.venue;
                            // Get details if there is a description
                            if (response.description) {
                                place.id = response.id;
                                place.name = response.name;
                                place.address = response.location.address;
                                place.postalCode = response.location.postalCode;
                                place.coords = {'lat': null, 'lon': null};
                                place.coords.lat = response.location.lat;
                                place.coords.lon = response.location.lng;
                                place.url = 'http://foursquare.com/v/' + place.id;
                                place.description = response.description;
                                // Get photos where type=venue, group [1]
                                place.photo = response.photos.groups[1].items[1].url.
                                    replace('original', img_size);
                                places.push(place);
                            }
                            placeCounter++;
                            // If all details collected, callback
                            if (placeCounter >= itemsLength) {
                                callback(places, null);
                            }
                        });
                    }).on('error', function (error) {
                        callback(null,null);
                    });
                });
            } catch (error) {
                callback(null,null);
            }
        });
    }).on('error', function (error) {
        callback(null,null);
    });
};



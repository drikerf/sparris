var express = require('express');
var foursquare = require('./foursquare.js');
// init app
var app = express();

// Set template engine
app.set('view engine', 'jade');

// Set template dir
app.set('views', __dirname + '/views');

// Static files
app.use(express.static(__dirname + '/public'));

// Enable logger
// app.use(express.logger('dev'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api/places', function (req, res) {
    // Get lat, lon
    var coords = {'lat': req.query.lat, 'lon': req.query.lon}
    // TODO: Get places from foursquare.api.getPlaces by coords
    foursquare.getPlaces(coords, function (places, error) {
        if (error) {
            res.end();
        }
        res.json(places);
    });
});

app.get('/about', function (req, res) {
    res.render('about');
});

// Port
var port = process.env.PORT || 5000;

// Listen
app.listen(port, function () {
    console.log('Listening on ' + port);
});


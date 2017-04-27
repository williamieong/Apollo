var http        = require('http'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    fs          = require('fs'),
    passport = require('passport'),
    assert = require('assert'),
    SpotifyStrategy = require('./node_modules/passport-spotify/lib/passport-spotify/index').Strategy,
    YoutubeStrategy = require('./node_modules/passport-youtube-v3/lib/passport-youtube-v3/index').Strategy,
    cacheController = require('./server/controllers/cache-controller'),
    request = require("request");

var app = express();

app.get('/server', function (req, res) {
    res.sendFile(__dirname + '../../server.js');
});

var server = require("/server");

    console.log("hello uid");
    console.log(server.uid);
app.controller('profileController', ['$scope', '$resource', function($scope, $resource){
}])
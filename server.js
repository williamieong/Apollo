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
    session = require("express-session")
 
//Intialization
var app = express();
app.use(session({secret: 'Apollo'}));
app.use(passport.initialize());
app.use(passport.session());
 
//this creates a connection to the database
mongoose.connect('mongodb://localhost:27017/Apollo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error to mongoose'));
db.once('open', function(){
    console.log("Connected to Mongoose!!!");
});
 
//this allows json objects to be interpreted on the backend
app.use(bodyParser());
 
//Code for Spotify Passport Login
var appKey = '5aa05f93b5ae4ba7818d08e802c00b60';
var appSecret = '43e183cdcbb24422bd15b5ec77f04d4e';

//Code for Youtube Passport Login
var youtubeAppKey = '159716235186-itggb3baeik7ge86bmd3lqptklibnuda';
var youtubeAppSecret = '4GnbHDbjrLff0tbi25pKh7jh';
var youtubeAPIKey = 'AIzaSyCJ07egBshZOxgyg3k2BG5FDTu8oN-uHrY';

//Tokens
var youtubeAccessToken = '';
var youtubeRefreshToken = '';
var playlists = {};
var playlistTracks = {};
var videoIDS = [];
var newPlaylistId = '';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 
 
// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      //Setting variables for user session
      db.collection("Users").find({id: profile.id},{$exists: true}).toArray(function(err, doc){
        if(doc.length!=0)
        {
          //console.log("found user");
          db.collection("Users").update({id: profile.id},{id: profile.id, name: profile.displayName, email: profile.emails[0].value, spotifyToken: accessToken, spotifyRefToken: refreshToken})
        }
        else {
          //console.log("new user");
          db.collection("Users").insert({id: profile.id, name: profile.displayName, email: profile.emails[0].value, spotifyToken: accessToken, spotifyRefToken: refreshToken});
        }
        return done(null, profile);}

      )
    });
  }));
 
// Use the YoutubeStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new YoutubeStrategy({
  clientID: youtubeAppKey,
  clientSecret: youtubeAppSecret,
  callbackURL: 'http://localhost:3000/callback2'
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      youtubeAccessToken = accessToken;
      youtubeRefreshToken = refreshToken;
      return done(null, profile);
    });
  }));

// Functions
function getVideoIDS(val, callback) {
  console.log("in getVideoIDS");
  var numVids = playlistTracks.info.items.length;
  for (i = 0; i < numVids; i++){
    //var test = playlistTracks.info.items[i].artists[0];
    var artistName = playlistTracks.info.items[i].track.album.artists[0].name;
    var vidName = playlistTracks.info.items[i].track.name;
    var query = artistName + " " + vidName;
    console.log(query);

    var options = { method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      qs: 
       { part: 'snippet',
         q: query,
         key: youtubeAPIKey,
         type: 'video' },
      headers: 
       { 'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var firstVideo = JSON.parse(body);
      var firstVideoId = firstVideo.items[0].id.videoId;
      videoIDS.push(firstVideoId);
    });
  }

};

function createPlaylist(val, callback) {
  console.log("in createPlaylist");
    var options = { method: 'POST',
      url: 'https://www.googleapis.com/youtube/v3/playlists',
      qs:
       { part: 'snippet, status',
         access_token: youtubeAccessToken},
      headers:
       { 'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body:
       { snippet: { title: val, description: 'test' },
         status: { privacyStatus: 'public' } },
      json: true };
     
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
};

// Need to replace playlist Id from input
// inconsistent behavior, does not add the whole playlist, and different videos
var pushVideos = function(val) {
  console.log("in pushVideos");
  console.log("video length", videoIDS.length);

  var i = 0;                     //  set your counter to 0
  var length = videoIDS.length;

  function myLoop () {           //  create a loop function
     setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        var options = { method: 'POST',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        qs: 
         { part: 'snippet, status',
           access_token: youtubeAccessToken},
        headers: 
         { 'cache-control': 'no-cache',
           'content-type': 'application/json' },
        body: 
         { snippet: 
            { playlistId: newPlaylistId,
              resourceId: { videoId: videoIDS[i], kind: 'youtube#video' } } },
        json: true };

        request(options, function (error, response, body) {
          console.log("This is the current video id i am trying to push " + options.body.snippet.resourceId.videoId);
          if (error) throw new Error(error);
        });

        i++;                     //  increment the counter
        if (i < videoIDS.length) {            //  if the counter < 10, call the loop function
           myLoop();             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
     }, 100)
  }

  myLoop();                      //  start the loop

}; // Ends pushVideo


// var setYoutubeToken = function(authToken) {


// }; // Ends setYoutubeToken


// Express Paths
 
// When someone makes a request to our home directory, this loads demonstration.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/views/login.html');
});

app.get('/profile', function (req, res) {
    res.sendFile(__dirname + '/client/views/profile.html');
    //console.log(res);
});

app.get('/demonstration.html', function (req, res) {
    res.sendFile(__dirname + '/client/views/demonstration.html');
});


///////////////////////////////////////////////////////////////////
 
// Spotify Paths
app.get('/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative'], showDialog: true}),
  function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
});
 
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("Printing from callback");
    req.session.passport.user.userSpotifyId = req.session.passport.user.id
    console.log(req.session.passport.user.userSpotifyId);
    res.redirect('/setSpotifyToken');
  });

app.get('/transferPlaylist',
  function(req, res) {
    console.log("Testing");
  });

app.get('/setSpotifyToken',
  function(req, res) {
    console.log("Where is this auth token");
    //console.log(db.collection("Users").find({id: req.session.passport.user.userSpotifyId}));
    //var token = db.collection("Users").find({id: "williamthehalo"}, {spotifyToken: 1}).toArray();
    var answer;
    db.collection("Users").find({id: req.session.passport.user.userSpotifyId}).toArray(function(err, doc) {
      answer = doc[0].spotifyToken;
      req.session.passport.user.spotifyToken = answer;
      console.log(req.session.passport.user.spotifyToken);
      res.redirect('/demonstration.html');
    });
  });

app.get('/getPlaylist',
  function(req, res) {
  var options = { method: 'GET',
  url: 'https://api.spotify.com/v1/users/' + req.session.passport.user.userSpotifyId +'/playlists',
  qs: { Scope: 'playlist-read-private' },
  headers: 
   { authorization: 'Bearer ' + req.session.passport.user.spotifyToken} };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    playlists.info = body;
    console.log(playlists.info);
  });
  });

app.get('/getPlaylistTracks',
  function(req, res) {
  console.log("Getting Playlist Tracks")
  var options = { method: 'GET',
  url: 'https://api.spotify.com/v1/users/' + req.session.passport.user.userSpotifyId + '/playlists/' + '5tTkRKHnW0uLWEnqQ8CvnW/tracks',
  qs: { Scope: 'playlist-read-private' },
  headers: 
   { authorization: 'Bearer ' + req.session.passport.user.spotifyToken
} };


request(options, function (error, response, body) {
  if (error) throw new Error(error);
  playlistTracks.info = JSON.parse(body);
});
  }
);

// Youtube Paths
app.get('/youtube',
  passport.authenticate('youtube', {scope: "https://www.googleapis.com/auth/youtube", showDialog: true}),
  function(req, res){
});

app.get('/callback2',
  passport.authenticate('youtube', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("Printing from callback 2");
    req.session.passport.user.userYoutubeId = req.session.passport.user.displayName;
    console.log(req.session.passport.user.userYoutubeId);

    // // Adding Youtube Token to User Session
    // db.collection("Users").find({id: profile.id},{$exists: true}).toArray(function(err, doc){
    //   if(doc.length!=0)
    //   {
    //     console.log("Updating User with Youtube Token");
    //     db.collection("Users").update({id: req.session.passport.user.userSpotifyId}, {$set : {"youtubeToken":1}})
    //   }
    // });

    res.redirect('/demonstration.html');
  });

app.get('/createPlaylist',
  function(req, res) {
    console.log("in express create Playlist");
    var options = { method: 'POST',
      url: 'https://www.googleapis.com/youtube/v3/playlists',
      qs:
       { part: 'snippet, status',
         access_token: youtubeAccessToken},
      headers:
       { 'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body:
       { snippet: { title: 'CS411 Demonstration i didnt cheat', description: 'test' },
         status: { privacyStatus: 'public' } },
      json: true };
     
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      newPlaylistId = body.id;
      // var obj =  JSON.parse(body);
      // console.log(obj[0]);
    });
  }
);

app.get('/updatePlaylist',
  function(req, res) {
    // console.log("In UpdatePlaylist");
    // console.log(youtubeAccessToken);
    // var options = { method: 'POST',
    //   url: 'https://www.googleapis.com/youtube/v3/playlistItems',
    //   qs: 
    //    { part: 'snippet, status',
    //      access_token: youtubeAccessToken},
    //   headers: 
    //    { 'cache-control': 'no-cache',
    //      'content-type': 'application/json' },
    //   body: 
    //    { snippet: 
    //       { playlistId: newPlaylistId,
    //         resourceId: { videoId: 'YQHsXMglC9A', kind: 'youtube#video' } } },
    //   json: true };

    // request(options, function (error, response, body) {
    //   if (error) throw new Error(error);

    //   console.log(body);
    // });
  getVideoIDS();
  setTimeout(pushVideos, 500);


});

app.get('/searchYoutube',
  function(req, res) {
  console.log("in searchYoutube");
  var options = { method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    qs: 
     { part: 'snippet',
       q: 'Run The Jewels',
       key: youtubeAPIKey,
       type: 'video' },
    headers: 
     { 'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    //console.log("finished searchYoutube");
  });

  //console.log(req.session.passport.user.id);
  // req.session.passport.user.test = "test text";
  // console.log(req.session.passport.user.test);
}); // Closes searchYoutube
 
// This just creates a shortcut for when referreing to /client/js directory
app.use('/js', express.static(__dirname + '/client/js'));
 
// REST API
app.get('/api/cache', cacheController.list);
app.post('/api/cache', cacheController.create);
 
// Binds socket and port
app.listen(3000, function() {
  console.log('I\'m Listening on 3000');
})
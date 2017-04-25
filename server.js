//async
//These are the modules which the server is using
var http        = require('http'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    fs          = require('fs'),
    passport = require('passport'),
    SpotifyStrategy = require('./node_modules/passport-spotify/lib/passport-spotify/index').Strategy,
    YoutubeStrategy = require('./node_modules/passport-youtube-v3/lib/passport-youtube-v3/index').Strategy,
    cacheController = require('./server/controllers/cache-controller'),
    request = require("request");
 
//Intialization
var app = express();
app.use(passport.initialize());
app.use(passport.session());
 
//this creates a connection to the database
mongoose.connect('mongodb://localhost:27017/Apollo');
 
//this allows json objects to be interpreted on the backend
app.use(bodyParser());
 
//Code for Spotify Passport Login
var appKey = '5aa05f93b5ae4ba7818d08e802c00b60';
var appSecret = '43e183cdcbb24422bd15b5ec77f04d4e';

//Code for Youtube Passport Login
var youtubeAppKey = '159716235186-itggb3baeik7ge86bmd3lqptklibnuda';
var youtubeAppSecret = '4GnbHDbjrLff0tbi25pKh7jh';

//Tokens
var userAccessToken = '';
var userRefreshToken = '';

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
      userAccessToken = accessToken;
      userRefreshToken = refreshToken;
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }));
//////////////
 
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
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }));
//////////////
 
//when someone makes a request to our home directory, this loads demonstartion.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/views/demonstration.html');
    //res.render('demonstration.html', { user: req.user });
});
 
//TEST FUNCTION FOR PASSPORT AUTH.
app.get('/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative'], showDialog: true}),
  function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
});
 
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // console.dir(res);
    res.redirect('/');
  });

app.get('/getPlaylist',
  function(req, res) {
  //   ajax({
  //     url: 'https://api.spotify.com/v1/users/williamthehalo/playlists',
  //     qs: { Scope: 'playlist-read-private' },
  //     headers: 
  //       {authorization: 'Bearer ' + userAccessToken},
  //   success: function (response) {
  //     console.log("We suceed in getPlaylist");
  //     console.dir(response);
  // }

  // });
  var options = { method: 'GET',
  url: 'https://api.spotify.com/v1/users/williamthehalo/playlists',
  qs: { Scope: 'playlist-read-private' },
  headers: 
   { authorization: 'Bearer ' + userAccessToken} };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

  }
   );
/////////////////////////
 

//TEST FUNCTION FOR PASSPORT YOUTUBE AUTH.
app.get('/youtube',
  passport.authenticate('youtube', {scope: "https://www.googleapis.com/auth/youtube", showDialog: true}),
  function(req, res){
});
app.get('/callback2',
  passport.authenticate('youtube', { failureRedirect: '/login' }),
  function(req, res) {
    // console.dir(res);
    res.redirect('/');
  });
/////////////////////////
 
////This just creates a shortcut for when referreing to /client/js directory
app.use('/js', express.static(__dirname + '/client/js'));
 
//REST API
app.get('/api/cache', cacheController.list);
app.post('/api/cache', cacheController.create);
 
//Binds socket and port
app.listen(3000, function() {
  console.log('I\'m Listening on 3000');
})
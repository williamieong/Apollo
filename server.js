//async
//These are the modules which the server is using
var http		= require('http'),
	express		= require('express'),
	bodyParser	= require('body-parser'),
	mongoose	= require('mongoose'), 
	fs 			= require('fs'),
	cacheController = require('./server/controllers/cache-controller');

var app	= express();

//this creates a connection to the database
mongoose.connect('mongodb://localhost:27017/Apollo');

//this allows json objects to be interpreted on the backend
app.use(bodyParser());

//when someone makes a request to our home directory, this loads demonstartion.html
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/views/demonstration.html');
});

////This just creates a shortcut for when referreing to /client/js directory 
app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.get('/api/cache', cacheController.list);
// app.post('/api/cache', cacheController.create);

//Binds socket and port
app.listen(3000, function() {
  console.log('I\'m Listening...');
})
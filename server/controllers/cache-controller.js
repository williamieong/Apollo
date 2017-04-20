//loading in model for chaced data
var Cache = require('../models/cache');

module.exports.create = function (req, res) {
	console.log("request has been made")
	//create a new object of model type and fill it with requested data
	var cache = new Cache(req.body);
	//save it into the database
	cache.save(function (err, result) {
	res.json(result);
	});
}

//find a request
module.exports.list = function (req, res) {
  Cache.find({}, function (err, results) {
    console.log("Getting list")
    res.json(results);
  });

}

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album'
        },
        success: function (response) {
            //createCacheEntry(response);
            //cacheController.createCacheEntry(response);
            console.log("In searchAlbums");
            //console.log(response);
            console.dir(response);
            resultsPlaceholder.innerHTML = template(response);
        }
    });
};
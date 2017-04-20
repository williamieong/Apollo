 //This is a front end controller to deal with data submitted
//It will send the data to the server which will store it in the database
app.controller('cacheController', ['$scope', '$resource', function ($scope, $resource) {

  var templateSource = document.getElementById('results-template').innerHTML,
      template = Handlebars.compile(templateSource),
      resultsPlaceholder = document.getElementById('results'),
      playingCssClass = 'playing',
      audioObject = null;

  // /api/cache is the base url for things going to the server
  var Cache = $resource('/api/cache');

  //This is a call to the server to query a new result
  //I think it corresponds to the get function on the server
  Cache.query(function (results) {
    $scope.cache = results;
    // console.log("This is the current array on the front end")
    // console.dir($scope.cache)
  });

  //cached items
  $scope.cache = []

  //probably redo
  //this creates a new entry in the chache
  $scope.createCacheEntry = function () {
    var cache = new Cache();
    //this takes data from the html form and stores it in the name attribute for the new entry
    cache.name = $scope.cachedName;
    // cache.test = "Testing";
    //gives data to the server to be added to the cache
    meetup.$save(function (result) {
      $scope.cache.push(result);
      $scope.cachedName = '';
    });
  }

  $scope.searchAlbums = function () {
      var cache = new Cache();
      cache.name = $scope.cachedName;
      console.log("In controller, using searchAlbums")

      var found = false;
      var album;
      for (i = 0; i < $scope.cache.length; i++) { 
        if ($scope.cache[i].name == cache.name) { 
          console.log("We found it")
          found = true;
          album = $scope.cache[i];
          console.log("Setting album")
          console.log(album)
          //resultsPlaceholder.innerHTML = template($scope.cache[i]);
          break;
          }
      }

      if (found == true) {
          $.ajax({},
          resultsPlaceholder.innerHTML = template(album);
          );
      }
      else {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: cache.name,
                type: 'album'
            },
            success: function (response) {
                console.log("In searchAlbums");
                console.dir(response);
                cache.albums = response;
                resultsPlaceholder.innerHTML = template(response);

                // Code to test if it hits node
                cache.$save(function (result) {
                $scope.cache.push(result);
                $scope.cachedName = '';
        });
            }
        });
    }





  };

}]);
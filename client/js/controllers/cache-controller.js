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
  });

  //cached items
  $scope.cache = [];
  $scope.videos = ["Drake Forever", "Run The Jewels", "Adele"];
  $scope.videoURLs = [];

  //probably redo
  //this creates a new entry in the chache
  $scope.createCacheEntry = function () {
    var cache = new Cache();
    //this takes data from the html form and stores it in the name attribute for the new entry
    cache.name = $scope.cachedName;
    //gives data to the server to be added to the cache
    meetup.$save(function (result) {
      $scope.cache.push(result);
      $scope.cachedName = '';
    });
  }


  $scope.searchAlbums = function () {
      var cache = new Cache();
      cache.name = $scope.cachedName;
      console.log("In controller, using searchAlbums");
      console.log(cache.name);
      console.log("THIS IS WHAT WE WANT");
      console.dir($resource);

    //   for (i = 0; i < $scope.videos.length; i++){
    //   $.ajax({
    //     url: 'https://www.googleapis.com/youtube/v3/search',
    //     data: {
    //         q: $scope.videos[i],
    //         part: "snippet",
    //         key: "AIzaSyCJ07egBshZOxgyg3k2BG5FDTu8oN-uHrY",
    //         type: "video"

    //     },
    //     success: function (response) {
    //         console.log("In Search Album");
    //         var firstVideo = response.items[0].id.videoId;
    //         console.log("Final answer")
    //         console.dir(firstVideo);
    //         $scope.videoURLs.push(firstVideo);
    //     }

    // });
    // console.log("printing array")
    // console.dir($scope.videoURLs);

    // }


      var found = false;
      var album;
      for (i = 0; i < $scope.cache.length; i++) { 
        if ($scope.cache[i].name == cache.name) { 
          console.log("We found it")
          found = true;
          album = $scope.cache[i];
          console.log("Setting album")
          console.log(album)
          break;
          }
      }

      if (found == true) {
        console.log("")
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
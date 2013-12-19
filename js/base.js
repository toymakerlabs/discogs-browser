//JQUERY PUBSUB. Thanks @Cowboy.

(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));




var DC = {
	config:{
		searchURL:"http://api.discogs.com/database/search",
		releaseURL:"http://api.discogs.com/release/",
		maxImages:1000,
		requestsPerSecond:1,
		resultsPerPage:40,
		paginate:10
	}
	
}

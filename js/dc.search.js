//http://www.slideshare.net/zdennis/javascript-code-organizations-patterns-slides-zach-dennis p 31



// DC.Search = function(){
//     this.query = null;
//     this.pages = 0;
//     this.page = 0;
// }

// DC.Search.prototype = {
//     getReleases:function(formSearchQuery){
//     	this.query = formSearchQuery;

//     	$.ajax({
//             url: 'http://api.discogs.com/database/search',
//             type: "GET",
//             dataType: 'jsonp',
//             data: {
//                 q:query,
//                 release_title:fields.release_title.val(),
//                 artist:fields.artist.val(),
//                 catno:fields.catno.val(),
//                 page:release_page,
//                 per_page: '9',
//                 type:"release",
//             },
//             success: function (data) {
//                 parseReleases(data);
//                 doPagination(data);

//             },
//             error:function(msg){
//                 console.log(msg)
//             }
//         });

//     	this.pages = data.pages;
//     	this.page = data.page;
//     },
//     getReleaseDetails:function(releaseID){
//     	 $.ajax({
//             url: 'http://api.discogs.com/release/'+releaseID,
//             type: "GET",
//             dataType: 'jsonp',
//             success: function (data) {
//                 populateDetails(data);
//             }
//         });
//     }
// }











//details dataset model
//returns a release object for a given id
DC.DetailsDataset = (function(){
	var release = null;
	return {
		populate:function(response){
			release = response.resp.release;
			console.log(release)
			$.publish("onDetailsLoaded");
		},
		getData:function(){
			return data;
		}
	}
})();

//Details Search Controller
DC.ReleaseDetails = (function(){
	return {
		get:function(id){
			$.ajax({
	            url: DC.config.releaseURL+id,
	            type: "GET",
	            dataType: 'jsonp',
	            success: function (response) {
	                DC.DetailsDataset.populate(response);
	            },
		        error:function(msg){
		            console.log(msg);
		        }
	        });
		}
	}
})();




//Releases dataset model
//returns an array of release objects for given search criteria
DC.ReleaseDataset = (function(){
	var results = null,
		pages = 0,
		page  = 0,
		total = 0;

	return {
		populate:function(response){
			results = response.data.results;
			pages = response.data.pagination.pages;
			page = response.data.pagination.page;
			total = response.data.pagination.items;
			$.publish("onReleasesLoaded");
		},
		getPage:function(){
			return page;
		},
		getPages:function(){
			return pages;
		},
		getResults:function(){
			return results;
		}
	}

})();




//validate form data and build a search query object to return to the search function
DC.SearchFormView = (function(){
	var search_data = {},
		fields = {
	        release_title:$('#dc-title'),
	        artist:$('#dc-artist'),
	        catno:$('#dc-catno'),
	        format:$('#dc-format'),
	        upc:$('#dc-upc')
	    }

    function validate() {
    	//validate and build the serch data object for search
    	search_data = {
	        q:fields.format.val() ? "format:"+fields.format.val() : "",
	        release_title:fields.release_title.val(),
	        artist:fields.artist.val(),
	        catno:fields.catno.val(),
	        per_page: DC.config.resultsPerPage,
	        type:"release",
	    }
    }

    return {
    	getValidData:function(){
    		return search_data;
    	}
    }
	
})();



//Releases search controller
DC.Releases = (function(){
	var currentPage = 1,
		query = null;

	function getReleases(query){
		query.page = currentPage;
		$.ajax({
	        url: DC.config.searchURL,
	        type: "GET",
	        dataType: 'jsonp',
	        data: query,
	        success: function (response) {
	        	DC.ReleaseDataset.populate(response);
	        },
	        error:function(msg){
	            console.log(msg)
	        }
        });
	}
	return {
		get:function(){
			query = DC.SearchFormView.getValidData();
			query.type = "release";
			getReleases(query);
		},
		nextPage:function(){
			//next ajax
			if(currentPage < DC.ReleaseDataset.getPages()){
				currentPage++;
				console.log(currentPage);
				getReleases(query);
			}
		},
		prevPage:function(){
			//prev ajax
			if(currentPage >0){
				currentPage --;
				getReleases(query);
			}
		}
	}
})();




















//template Addy Osmani http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript

// var myNamespace = (function () {

//   var myPrivateVar, myPrivateMethod;

//   // A private counter variable
//   myPrivateVar = 0;

//   // A private function which logs any arguments
//   myPrivateMethod = function( foo ) {
//       console.log( foo );
//   };

//   return {

//     // A public variable
//     myPublicVar: "foo",

//     // A public function utilizing privates
//     myPublicFunction: function( bar ) {

//       // Increment our private counter
//       myPrivateVar++;

//       // Call our private method using bar
//       myPrivateMethod( bar );

//     }
//   };

// })();
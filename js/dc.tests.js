DC.testReleases = function(){
	var fields = {
        release_title:$('#dc-title'),
        artist:$('#dc-artist'),
        catno:$('#dc-catno'),
        format:$('#dc-format'),
        upc:$('#dc-upc')
    }
    fields.format.val("vinyl");
	fields.release_title.val();
    fields.artist.val("kiss");
    fields.catno.val();
    setTimeout(function(){
   	  	DC.Releases.get();

    },20)

    
}

DC.testDetails = function(){
	var releaseID = 1443905;
	DC.ReleaseDetails.get(1443905);
}

DC.testDataSet = function(){
	DC.testReleases();
	$.subscribe("onReleasesLoaded",function(){
		console.log(DC.ReleaseDataset.getPage());
		console.log(DC.ReleaseDataset.getPages());
		console.log(DC.ReleaseDataset.getResults());
	});
}
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

   	DC.Releases.get();

    
}

DC.testDetails = function(){
	var releaseID = 1;
	DC.ReleaseDetails.get(73285);
}

DC.testDataSet = function(){
	DC.testReleases();
	$.subscribe("onReleasesLoaded",function(){
		console.log(DC.ReleaseDataset.getPage());
		console.log(DC.ReleaseDataset.getPages());
		console.log(DC.ReleaseDataset.getResults());
	});
}
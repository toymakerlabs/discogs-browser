

//these two could be separated a bit. make a class for the results window, control window
////and bridge them together with a controller. that would help curb some event pollution

DC.ResultsPanel = (function(){
	var results_wrapper = $("#results-view-panel"),
	    results_panel = $('#dc-results'),
	    controls = $('#dc-controls'),
	    release_template = $("#release-results").html(),
	    entries = Handlebars.compile(release_template),
	   	status = new DC.ui.StatusIcon("#dc-status"),
	   	details_template = $("#release-details").html(),
	   	release_details = Handlebars.compile(details_template),
	   	direction = "next";
	
	results_panel.dynamicpanel({
        duration:500,
        ease3d:'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    });

	function addReleases(){
		var target = results_panel.find(".item").not(".active");
        target.html(entries(DC.ReleaseDataset.getResults()));

        //bind events
        $('td.release-info').on('click',function(e){
        	var releaseID = $(this).attr('data-release');
            DC.ReleaseDetails.get(releaseID);
            console.log('click');
        })
	}

	function getDetails(){
		var target = results_panel.find(".item").not(".active");
        target.html(release_details(DC.DetailsDataset.getRelease()));
	}

	function setStatus(statusCode){
		switch (statusCode) {
			case 0:
				//loading
				console.log('loading');
				status.show();
				break;
			case 1:
				//complete
				console.log("complete");
				status.hide();
				break;
		}
	}


	//this needs to go on the controller
	///main form search
	$('#browse-releases').unbind("submit").submit(function(e) {
        e.preventDefault();  // Doesn't matter
        DC.Releases.get();
    });



	$.subscribe("onPanelBack",function(){
		results_panel.dynamicpanel("prev");
	})	
	$.subscribe("onDetailsLoaded",function(){
		getDetails();
		setStatus(1);
		results_panel.dynamicpanel("next");
	});	
	$.subscribe("onLoadStarted",function(e,type){
		direction = (type == "prev")  ? "prev": "next";
		setStatus(0);
	})
	$.subscribe("onReleasesLoadComplete",function(){
		setStatus(1);
		addReleases();
		results_panel.dynamicpanel(direction);
	})

})();




DC.ControlPanel = (function(){
	var controls_panel = $('#dc-controls'),
		pagination = $('#dc-results-pagination'),
		pagination_template = $("#results-pagination").html(),
		pages_output =  Handlebars.compile(pagination_template),
		next_button = $("#pag-next"),
		prev_button = $("#pag-prev"),
		moveControls = true,
		page =0,
		pages =0;

	controls_panel.dynamicpanel({
        duration:500,
        ease3d:'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    });

	function buildPaginationList(){
		var list = {};
		pages = DC.ReleaseDataset.getPages();
		page  = DC.ReleaseDataset.getPage();
		
		list.entries = [];
		console.log(page)
		console.log(pages)
        if(pages>8){
            for (var i=0;i<6;i++){
                if (page == pages && pages > 1){
                    list.entries.push({number:String((pages-6)+i)})
                }else{
                    list.entries.push({number:String(page+i)})
                };
            }
            list.entries.push({number:"...",isDisabled:true});
            list.entries.push({number:String(pages)});
        }else{
            for (i=1;i<=pages;i++){
                list.entries.push({number:String(i)});
            }
        }
        console.log(list)
       	return list;
	}
	function paginateCurrent(){
		var target = controls_panel.find(".item.active");
		var pagination = buildPaginationList();
        target.html(pages_output(pagination));

	}
	function paginateNew(){
		var target = controls_panel.find(".item").not(".active");
        target.html(pages_output(buildPaginationList()));
	}
	function addDetailControls(){
		var target = controls_panel.find(".item").not(".active");
		target.html("<button id='dc-details-back' class='btn btn-primary'><i class='icon-double-angle-left'></i> Back To Results</button><button id='dc-details-add' class='btn btn-primary'><i class='icon-download'></i> Add</button>");
		
		$('#dc-details-back').click(function(e){
            e.stopPropagation();
            $.publish("onPanelBack");
        });
	}

	function bindPagination(){
		console.log(page)
		console.log(pages)
        if(page == pages){
            $('#pag-next').parent().addClass('disabled');
        }
        if(page == 1){
            $('#pag-prev').parent().addClass('disabled');
            $('#pag-first').parent().addClass('disabled');
        }
       	if(page >1 && page < pages){
            $('#pag-prev').parent().removeClass('disabled');
            $('#pag-first').parent().removeClass('disabled');
        }

        controls_panel.find("[data-page='" + page + "']").addClass('active');

        //bind events
    	$("#pag-next").click(function(e){
    		e.preventDefault();
            DC.Releases.nextPage();
        })
        //Pagination prev
        $("#pag-prev").click(function(e){
        	e.preventDefault();
           	DC.Releases.prevPage();
            
        })
        $("#pag-first").click(function(e){
    		e.preventDefault();
            DC.Releases.getReleasePage(1);
        })
        controls_panel.off().on("click","li",function(e){
            //match digits to avoid adding "next/prev" to currentpage
            var index = $(this).data("page");
            e.stopPropagation();
            e.preventDefault();
            console.log("clicky")
            if(index != null){
                console.log(index);
                DC.Releases.getReleasePage(index);
            }
        });

	}

	$.subscribe("onLoadStarted",function(e,type){
		moveControls = (type=="new") ? true : false
	})

	$.subscribe("onPanelBack",function(e){
		controls_panel.dynamicpanel("prev");
	})

    $.subscribe("onReleasesLoadComplete",function(){
    	if(moveControls) {
    		paginateNew();
    		controls_panel.dynamicpanel("next");

    	}else{
    		paginateCurrent();

    	}
    	


        bindPagination()

	})

	$.subscribe("onDetailsLoaded",function(){
		addDetailControls();
		controls_panel.dynamicpanel("next");
		//getDetails();
		//results_panel.dynamicpanel("next");
	});	

})();


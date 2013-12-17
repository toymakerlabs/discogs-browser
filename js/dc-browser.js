$(function(){
    DiscogsBrowser.init()
})

function test(arguments){
    console.log(arguments)
}

var DiscogsBrowser  = (function(){

    //Element selectors and initial params
    var browser = $('#dc-browser'),
        results = $('#dc-results'),
        controls = $('#dc-controls'),
        pagination = $('#dc-results-pagination'),
        status = $('#dc-status'),
        release_template = $("#release-results").html(),
        details_template = $("#release-details").html(),
        pagination_template = $("#results-pagination").html(),
        entries = Handlebars.compile(release_template),
        release_details = Handlebars.compile(details_template),
        pages_output =  Handlebars.compile(pagination_template),
        currentPage = 1;

    var fields = {
        release_title:$('#dc-title'),
        artist:$('#dc-artist'),
        catno:$('#dc-catno'),
        format:$('#dc-format'),
        upc:$('#dc-upc')
    }

    var buttons = {
        browse:$('#dc-browse'),
        reset:$('#dc-reset'),
        details_back:$('#dc-details-back'),
        details_add:$('#dc-details-add'),
        page_next:$('#pag-next'),
        page_prev:$('#pag-prev')

    }


    function getReleases(release_page,paginate){
        var query = "";
        console.log("get")
        if(fields.format.val()){
            query = "format:"+fields.format.val();
        }

        //show status icon
        status.css({'display':'block'});

        //has to be executed from 127.0.0.1
        $.ajax({
            url: 'http://api.discogs.com/database/search',
            type: "GET",
            dataType: 'jsonp',
            data: {
                q:query,
                release_title:fields.release_title.val(),
                artist:fields.artist.val(),
                catno:fields.catno.val(),
                page:release_page,
                per_page: '9',
                type:"release",
            },
            success: function (data) {
                parseReleases(data);
                doPagination(data);
                
            },
            error:function(msg){
                console.log(msg)
            }
        });

    }

    //Parse the list of releases
    function parseReleases(release_list) {
        var releases = release_list.data.results,
            page = release_list.data.pagination.page,
            pages = release_list.data.pagination.pages;
        
        //get the next slide in the carousel and dump the templated data into it
        var target = results.find('div.item:not(.active)');
        target.html(entries(release_list.data));
        
        //hide the status icon
        status.css({'display':'none'});
        
        //jump the carousel to the next or previous item depnending on the page
        if(page>currentPage){
            results.carousel('next');
        }
        if(page<currentPage){
            results.carousel('prev');
        }
        currentPage = page;

        //enable the release list to be clicked - get the release data
        $('td.release-info').on('click',function(e){
            getReleaseDetails($(this).attr('data-release'));
            console.log('click');
        })

        console.log('success transition');
        results.carousel('prev');
        controls.carousel(1);

    }

    function doPagination(results){
        var pages    = results.data.pagination.pages,
            page     = results.data.pagination.page,
            items    = results.data.pagination.items,
            list = {};

        list.entries = [];

        if(pages>8){
            for (var i=0;i<6;i++){
                if (page == pages){
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
        pagination.html(pages_output(list))

        if(page >1){
            $('#pag-prev').parent().removeClass('disabled');
            $('#pag-first').parent().removeClass('disabled');
        }
        if(page == pages){
            $('#pag-next').parent().addClass('disabled');

        }
        if(page == 1){
            $('#pag-prev').parent().addClass('disabled');
            $('#pag-prev').parent().addClass('disabled');
        }

        if (pages < 8){
            pagination.find("[data-page='" + page + "']").addClass('active');
        }else{
            pagination.find('li:eq(2)').addClass('active');
        }
        



        //target.html(release_details(data.resp.release))
        //
        // //only show 11 pages for now due to space. add an advance pages button. 
        // if(pages>8){
        //     pages = 8;
        // }
        // for (i=1;i<=pages;i++){
        //     list += '<li><a href="#">'+i+"</a></li>";
        // }
        // pagination.html("<h5>Results Found: " +items+"</h5>&nbsp;<ul class='pagination'><li class='disabled'><a href='#' id='pag-prev'>Prev</a></li>"+list+"<li><a href='#' id='pag-next'>Next</a></li></ul>");
        // pagination.find('li:eq(1)').addClass('active');

        //Pagination next
        $('#pag-next').click(function(){
            if(page < pages){
                getReleases(page+1, true);
            }
        })
        //Pagination prev
        $('#pag-prev').click(function(){
            if(page>1){
                getReleases(page-1,true);
            }
        })


        pagination.off().on("click","li",function(e){
            //match digits to avoid adding "next/prev" to currentpage
            var index = $(this).data("page");
            e.stopPropagation();
            e.preventDefault();
            console.log("clicky")
            if(index != null){
                console.log(index);
                getReleases(index,true);

                // if(index == 1){
                //     buttons.page_next.parent().addClass('disabled');
                // }else {
                //     buttons.page_prev.parent().removeClass('disabled');
                // }
                // if(index == pages){
                //     buttons.page_next.parent().addClass('disabled');
                // }else{
                //     buttons.page_next.parent().removeClass('disabled');
                // }
            }
         });
    }

    //get the release data based on the discogs release ID
    function getReleaseDetails(releaseID){
        $.ajax({
            url: 'http://api.discogs.com/release/'+releaseID,
            type: "GET",
            dataType: 'jsonp',
            success: function (data) {
                populateDetails(data);
            }
        });

    }

    //Dump the release info from the Release Detail query into the next slide
    function populateDetails(data){
        //console.log(data.resp.release)
        var target = results.find('div.item:not(.active)');
        target.html(release_details(data.resp.release));

        var detail_controls = controls.find('div.item:not(.active)')
        detail_controls.html("<button id='dc-details-back' class='btn'><i class='icon-double-angle-left'></i> Back To Results</button><button id='dc-details-add' class='btn'><i class='icon-download'></i> Add</button>");

        results.carousel('next');
        controls.carousel('next');
        console.log("advance")

        $('#dc-details-back').click(function(e){
            e.stopPropagation();
            results.carousel('prev');
            controls.carousel('prev');
        });

        $('#dc-details-add').click(function(){
            alert('add');
        });
    }

    function resetBrowser() {
        results.find('.item').html('');
        pagination.html('');
        results.carousel(1);
        controls.carousel(1);

        fields.release_title.val("");
        fields.artist.val("");
        fields.catno.val("");
        fields.format.val("");
        fields.upc.val("");
    }

    function managePaginationState(page){
        //roll the pagination logic into here

    }

    function bindInteractions() {
        $('#dc-results').carousel({
            interval:false
        });
        $('#dc-controls').carousel({
            interval:false
        });

        buttons.browse.click(function(){
            getReleases(1,true);
        })

        buttons.reset.click(function(){
            resetBrowser();
        })

    }
    return{
        init:function(){
            //compile handlebars template
            bindInteractions();

        }
    }

})();
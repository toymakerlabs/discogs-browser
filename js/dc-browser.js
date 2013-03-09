$(function(){
    //$('#dc-browser').modal();
    $('#dc-results').carousel({
        interval:false
    });
    $('#dc-controls').carousel({
        interval:false
    });
    DiscogsBrowser.init()
})

var DiscogsBrowser  = (function(){
    var browser     = $('#dc-browser'),
        results     = $('#dc-search-results'),
        releases    = $('#dc-results-details'),
        release     = $("#release-results").html(),
        details     = $("#release-details").html(),
        entries     = Handlebars.compile(release),
        release_details = Handlebars.compile(details), 
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
        pages:$('#dc-results-pagination'),
        reset:$('#dc-reset')
    }


    function getReleases(release_page,paginate){
        var query = ""
        if(fields.format.val()){
            query = "format:"+fields.format.val()
        }
        $('#dc-status').css({'display':'block'});
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
                //console.log(data);
                parseReleases(data);
                if(paginate == true){
                    doPagination(data);
                    $('#dc-results').carousel('prev');
                    $('#dc-controls').carousel(1);
                }
            }
        });

    }

    function parseReleases(results) {
       // console.log(results.data.results);
       console.log(results.data)
        var releases = results.data.results,
            page = results.data.pagination.page,
            pages = results.data.pagination.pages
        

            var target = $('#dc-results').find('div.item:not(.active)');
            target.html(entries(results.data));
            $('#dc-status').css({'display':'none'});
            
            if(page>currentPage){
                $('#dc-results').carousel('next');
            }
            if(page<currentPage){
                $('#dc-results').carousel('prev');
            }
            currentPage = page;

            $('td.release-info').on('click',function(e){
                getReleaseDetails($(this).attr('data-release'));
                console.log('click');
            })
        
        // console.log(page +"|"+currentPage)
        //currentPage = page;
        // $("#dc-results-pagination ul li").click(function(){
        //     var index = $(this).find('a').html();
        //     getReleases(index);
        // })

        // $('#dc-search-results').on('click','td.release-info',function(e){
        //     console.log($(this).attr('data-release'));
        //     $('.carousel').carousel('next');
        //     e.stopPropagation();
        // })

    }

    function getReleaseDetails(releaseID){
        $.ajax({
            url: 'http://api.discogs.com/release/'+releaseID,
            type: "GET",
            dataType: 'jsonp',
            success: function (data) {
                populateDetails(data);
            }
        });
        //console.log(releaseID);
        //populateDetails(1);

    }

    function populateDetails(data){
        //console.log(data.resp.release)
        var target = $('#dc-results').find('div.item:not(.active)');
        target.html(release_details(data.resp.release));

        var controls = $('#dc-controls').find('div.item:not(.active)');
        controls.html("<button id='dc-details-back' class='btn'><i class='icon-double-angle-left'></i> Back To Results</button><button id='dc-details-add' class='btn'><i class='icon-download'></i> Add</button>");

        $('#dc-results').carousel('next');
        $('#dc-controls').carousel('next');

        $('#dc-details-back').click(function(){
            $('#dc-results').carousel('prev');
            $('#dc-controls').carousel('prev');
        })

        $('#dc-details-add').click(function(){
            alert('add');
        })
    }


    function doPagination(results){
        var pages    = results.data.pagination.pages,
            items    = results.data.pagination.items,
            pagination = "";

        if(pages>11){
            pages = 11;
        }
        for (i=1;i<=pages;i++){
            pagination += '<li><a href="#">'+i+"</a></li>";
        }
        var controls = $('#dc-controls').find('#dc-results-pagination ul');
        controls.html("<h5>Results Found: " +items+"</h5>&nbsp;<ul><li class='disabled'><a href='#' id='pag-prev'>Prev</a></li>"+pagination+"<li><a href='#' id='pag-next'>Next</a></li></ul>")
        $("#dc-results-pagination ul").find('li:eq(1)').addClass('active')

        
        $('#pag-next').click(function(){
            if(currentPage<pages){
                getReleases(currentPage+1,false);
                $("#dc-results-pagination ul").find('.active').removeClass()
                $("#dc-results-pagination ul").find('li:eq('+(currentPage+1)+')').addClass('active');
                $('#pag-prev').parent().removeClass('disabled');
            }
            if(currentPage+1 == pages){
                $(this).parent().addClass('disabled');
            }
            //console.log(currentPage);
        })

        $('#pag-prev').click(function(){
            if(currentPage>1){
                getReleases(currentPage-1,false);
                $("#dc-results-pagination ul").find('.active').removeClass()
                $("#dc-results-pagination ul").find('li:eq('+(currentPage-1)+')').addClass('active');
                $('#pag-next').parent().removeClass('disabled');
            }
            if(currentPage-1 == 1){
                $(this).parent().addClass('disabled');
            }
            //console.log(currentPage);
        })

        $("#dc-results-pagination ul").on("click","li",function(){
            //match digits to avoid adding "next/prev" to currentpage
            var r = /\d+/;
            var index = $(this).find('a').html().match(r);

            if(index != null){
                console.log(index[0]);
                getReleases(index[0],false);
                $("#dc-results-pagination ul").find('.active').removeClass()
                $("#dc-results-pagination ul").find('li:eq('+(index[0])+')').addClass('active')

                if(index[0] == 1){
                    $('#pag-prev').parent().addClass('disabled');
                }else {
                    $('#pag-prev').parent().removeClass('disabled');
                }
                if(index[0] == pages){
                    $('#pag-next').parent().addClass('disabled');
                }else{
                    $('#pag-next').parent().removeClass('disabled');
                }
            }
         })

        // $('#dc-controls').carousel('next');
    }

    function resetBrowser() {
        $('#dc-results').find('.item').html('');
        //$('#dc-controls').find('.item').html('');
        $('#dc-results-pagination').html('');
        $('#dc-results').carousel(1);
        $('#dc-controls').carousel(1);

        fields.release_title.val("");
        fields.artist.val("");
        fields.catno.val("");
        fields.format.val("");
        fields.upc.val("");
    }

    function managePaginationState(){

    }

    function bindInteractions() {
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
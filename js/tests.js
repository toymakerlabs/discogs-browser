var tests = (function(){
    function run2(){
        $.ajax({
            type: 'GET',
            url: "http://api.discogs.com/database/search?callback=?",
            async: false,
            jsonpCallback: 'myJSON',
            contentType: "application/json",
            dataType: 'jsonp',
            data: { 
                q: 'nirvana', 
                per_page: '10' 
            }, 
            success: function(json) {
               console.log(json);
            },
            error: function(e) {
               console.log(e.message);
            }
        });
    }

    function run1(){
        $.ajax({ 
            url: 'http://api.discogs.com/search', 
            type: "GET", 
            dataType: 'jsonp', 
            data: { 
                q: 'nirvana', 
                per_page: '10' 
            }, 
            success: function (data) { 
                alert(data); 
                } 
            }); 
    }
    function run(){
        $.getJSON("http://api.discogs.com/artists/1?callback=?", function(resp) { 
            console.log(resp)
        }).error(function(data) { console.log(data) });
    }

    return {
    testAPI:function(){
        run();
    },
    testPagination:function(){
        var pages = 28;
        var page =1;
        var list = {};
        var page_template = $("#results-pagination").html();
        var pages_output =  Handlebars.compile(page_template);

        list.entries = [];

        if(pages>8){
            for (var i=0;i<4;i++){
                list.entries.push({number:String(page+i)});
            }
            list.entries.push({number:"...",isDisabled:true});
            for (var i=pages;i>pages-3;i--){
                list.entries.push({number:String(i)});
            }

        }else{
            for (i=page;i<=pages;i++){
                list.entries.push({number:String(i)});
            }
        }
        console.log(list);
        console.log(pages_output(list))
    }
}
})();





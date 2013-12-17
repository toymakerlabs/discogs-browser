var DCTEST = (function(){
    function bindInteractions() {
        $("#dc-results").dynamo();

        // buttons.browse.click(function(){
        //     getReleases(1,true);
        // })

        // buttons.reset.click(function(){
        //     resetBrowser();
        // })

    }
    return{
        init:function(){
            //compile handlebars template
            bindInteractions();

        }
    }

})();

/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "dynamicpanel",
        defaults = {
            duration : 500,
            ease3d : "ease-out"
        };

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.wrapper = null;

        this.init();
    }


    Plugin.prototype = {
        init: function() {
            console.log("dynamicpanel")
            var that = this;
            this.el = $(this.element);
            this.wrapper = this.el.children("div");
            this.width = this.wrapper.width();

            this.wrapper.children(".item.active").css({"-webkit-transform":"translate3d(0,0,0)"});
            this.wrapper.children(".item").not('.active').css({"-webkit-transform":"translate3d("+that.width+"px,0,0)"});
            this.wrapper.children(".item").css({"-webkit-transition":"none"});

            $(window).resize(function(){
                that.resize();
            })
        },
        resize:function(){
            //this.wrapper.children(".item.active").css({"left":0});
            //this.wrapper.children(".item").not('.active').css({"left":this.wrapper.width()})
            this.wrapper.children(".item.active").css({"-webkit-transform":"translate3d(0,0,0)"});
            this.wrapper.children(".item").not('.active').css({"-webkit-transform":"translate3d("+(-this.wrapper.width())+"px 0,0)"});
        },
        movePanels:function(direction){
            var startX = (direction === "forward") ? this.wrapper.width() : -this.wrapper.width();
            var active_slide = this.wrapper.children(".item.active");
            var disabled_slide = this.wrapper.children(".item").not('.active');
            var that = this;

            if(has3d){
                that.wrapper.children(".item").css({"-webkit-transition":"none"});
                disabled_slide.css({"-webkit-transform":"translate3d("+startX+"px,0,0)"});
                setTimeout(function(){
                    that.wrapper.children(".item").css({"-webkit-transition":"-webkit-transform "+that.options.duration+"ms "+that.options.ease3d});
                    disabled_slide.css({"-webkit-transform":"translate3d(0px,0,0)"});
                    active_slide.css({"-webkit-transform":"translate3d("+(-startX)+"px, 0,0)"});
                    setTimeout(function(){
                        disabled_slide.addClass('active');
                        active_slide.removeClass("active");
                    },defaults.duration)

                },20)
            }else{
                disabled_slide.css({"left":startX});
                disabled_slide.stop().animate({"left":0},that.options.duration);
                //console.log(disabled_slide)

                active_slide.stop().animate({"left":(-startX)},that.options.duration,function(){
                    disabled_slide.addClass('active');
                    active_slide.removeClass("active");
                });
            }

            
            



            // disabled_slide.css({"left":startX});
            // disabled_slide.stop().animate({"left":0},defaults.duration);
            // console.log(disabled_slide)

            // active_slide.stop().animate({"left":(-startX)},defaults.duration,function(){
            //     disabled_slide.addClass('active');
            //     active_slide.removeClass("active");
            // });
            
           // disabled_slide.css({"-webkit-transform":"translate3d(0,0,0)"});
            //disabled_slide.css({"-webkit-transform":"translate3d(0,0,0)"},defaults.duration);
            //active_slide.css({"-webkit-transform":"translate3d("+(-startX)+"px, 0,0)"});
            //     disabled_slide.addClass('active');
            //     active_slide.removeClass("active");
            // });
            //disabled_slide.addClass('active');
            //active_slide.removeClass("active");
        },
        next: function() {
           // console.log(colour);
            //console.log(this);
            console.log('next');
            this.movePanels("forward");
            //$(this.element).css("color", colour);  
        },
        prev:function(){
           // console.log(this);
            console.log('prev');
            this.movePanels("backward")
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations http://jsfiddle.net/yucCG/
    $.fn[pluginName] = function ( options ) {
        if (typeof options === "string") {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var plugin = $.data(this, 'plugin_' + pluginName);
            plugin[options].apply(plugin, args);
           });
        }
        else {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }
}

})( jQuery, window, document );





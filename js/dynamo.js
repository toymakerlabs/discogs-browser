
// ;(function ($, window, document, undefined ) {

//     var currentSlide = null,
//         has3d=null,
//         element = null,
//         animating = false,
//         wrapper=null;

//     var defaults = {
//         duration : 500,
//         ease3d : "ease-out"
//     };

//     function has3DTransforms() {
//         var el = document.createElement('p'), 
//             has3d,
//             transforms = {
//                 'WebkitTransform':'-webkit-transform',
//                 'MozTransform':'-moz-transform',
//             };
//         document.body.insertBefore(el, null);
//         for (var t in transforms) {
//             if (el.style[t] !== undefined) {
//                 el.style[t] = "translate3d(1px,1px,1px)";
//                 has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
//             }
//         }
//         document.body.removeChild(el);
//         return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
//     }

//     function resize(){
//         wrapper.children(".page.active").css({"left":0});
//         wrapper.children(".page").not('.active').css({"left":-wrapper.width()});
//     }

//     function movePanels(direction){
//         //position the panels apprpriate to the direction
//         var startX = (direction === "forward") ? wrapper.width() : -wrapper.width();
//         var active_slide = wrapper.children(".page.active");
//         var disabled_slide =  wrapper.children(".page").not('.active');
        
//         disabled_slide.css({"left":startX});
//         disabled_slide.stop().animate({left:"0px"},defaults.duration);
//         active_slide.stop().animate({left:-startX},defaults.duration,function(){
//             disabled_slide.addClass('active');
//             active_slide.removeClass("active");
//         });
//     } 

//     var methods = {
//         init : function(options) {
//             if(options) {
//                 $.extend(defaults,options);
//             }

//             //Add error handling if pages were not found
//             element = this;
//             wrapper = element.children("div");
//             console.log(wrapper.parent());
//             has3d = has3DTransforms();
//             wrapper.children(".page").not('.active').css({'left':wrapper.width()});
//             $(window).resize(function(){
//                 resize();
//             })
//             return this
//         },
//         next : function( ) {
//             if(!animating){
//                 movePanels("forward");
//             }
//             return this 
//         },// IS
//         prev : function( ) {  
//             if(!animating){
//                 movePanels("backward");
//             }
//             return this 
//         }
//     };

//     $.fn.dynamo = function(methodOrOptions) {
//         if ( methods[methodOrOptions] ) {
//             return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
//         } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
//             // Default to "init"
//             return methods.init.apply( this, arguments );
//         } else {
//             $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.dynamo' );
//         }    
//     };

// })( jQuery, window, document );







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
    var pluginName = "dynamo",
        defaults = {
            duration : 500,
            ease3d : "ease-out"
        };

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
            console.log("dyanmo")
            var that = this;
            this.wrapper = $(this.element).children("div");
            this.width = this.wrapper.width();

            $(window).resize(function(){
                that.resize();
            })
        },
        resize:function(){
            this.wrapper.children(".page.active").css({"-webkit-transform":"translate3d(0,0,0)"});
            this.wrapper.children(".page").not('.active').css({"-webkit-transform":"translate3d("+(-this.wrapper.width())+"px 0,0)"});
        },
        movePanels:function(direction){
            var startX = (direction === "forward") ? this.wrapper.width() : -this.wrapper.width();
            var active_slide = this.wrapper.children(".page.active");
            var disabled_slide =  this.wrapper.children(".page").not('.active');
            console.log(active_slide.position().left)
            
            // disabled_slide.css({"-webkit-transform":"translate3d(0,0,0)"});
            // disabled_slide.stop().animate({"-webkit-transform":"translate3d(0,0,0)"},defaults.duration);
            // active_slide.stop().animate({"-webkit-transform":"translate3d("+(-startX)+"0,0)"},defaults.duration,function(){
            //     disabled_slide.addClass('active');
            //     active_slide.removeClass("active");
            // });
            // 
            disabled_slide.css({"-webkit-transform":"translate3d(0,0,0)"});
            //disabled_slide.css({"-webkit-transform":"translate3d(0,0,0)"},defaults.duration);
            active_slide.css({"-webkit-transform":"translate3d("+(-startX/2)+"px, 0,0)"});
            //     disabled_slide.addClass('active');
            //     active_slide.removeClass("active");
            // });
            disabled_slide.addClass('active');
            active_slide.removeClass("active");
        },
        next: function() {
           // console.log(colour);
            console.log(this);
            console.log('next');
           this.movePanels("forward");
            //$(this.element).css("color", colour);  
        },
        prev:function(){
            console.log(this);
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





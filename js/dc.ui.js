DC.ui = {}
DC.ui.StatusIcon = function(el){
	this.element = $(el);
	this.state = 0;
}
DC.ui.StatusIcon.prototype = {
	show:function(){
		this.element.css({"display":"block"});
	},
	hide:function(){
		this.element.css({"display":"none"});
	}
}
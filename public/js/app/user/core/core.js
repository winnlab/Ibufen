import 'can/map/delegate/'
import 'can/map/define/'

import config from 'rConfig'
import Router from 'router'
import helpers from 'helpers'

var Core = can.Control.extend(
	{
		defaults: {
			
		}
	},
	
	{
		init: function() {
			this.window = $(window);
			
			this.main_container = $('#main_container');
			this.fixed_topper = $('#fixed_topper');
			
			this.footer = $('#footer');
			
			this.warning_container = this.element.find('.warning_container');
			
			this.small = 'small';
			
			this.resize();
		},
		
		'{window} scroll': function(el, ev){
			var scroll_top = $(el).scrollTop(),
				func = 'removeClass',
				classname = 'scrolled';
			
			if(scroll_top) {
				func = 'addClass';
			}
			
			this.fixed_topper[func](classname);
		},
		
		'{window} custom_ready': function() {
			$('body').css({
				overflow: 'auto'
			});
			
			$('#preloader').fadeOut(300);
		},
		
		'{window} resize': 'resize',
		
		resize: function() {
			var wnd_width = this.window.width(),
				func = 'removeClass';
			
			if(wnd_width < 1200) {
				func = 'addClass';
			}
			
			this.main_container[func](this.small);
			
			this.change_warning_height();
		},
		
		// custom
		
		'{window} custom_warning': function(el, ev, classname) {
			this.warning_container.removeClass();
			this.warning_container.addClass('warning_container ' + classname);
			
			this.change_warning_height();
		},
		
		'.logo, .know_logo click': function() {
			$('html, body').scrollTop(0);
		},
		
		change_warning_height: function() {
			var height = 'auto';
			
			if(this.warning_container.hasClass('big')) {
				height = (this.window.height() * 0.15) | 0
			}
			
			this.warning_container.height(height);
		}
	}
);

new Core(document.body);

new Router(document.body, config.router);
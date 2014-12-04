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
			
			this.classes = [
				'mini',
				'small',
				'big',
				'huge'
			];
			
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
				class_index = 2;
			
			if(wnd_width < 768) {
				class_index = 0;
			} else if(wnd_width < 1200) {
				class_index = 1;
			} else if(wnd_width > 1360) {
				class_index = 3;
			}
			
			this.main_container.removeClass();
			this.main_container.addClass(this.classes[class_index]);
			
			this.change_warning_height();
		},
		
		// custom
		
		'{window} custom_warning': function(el, ev, classname) {
			this.warning_container.removeClass();
			this.warning_container.addClass('warning_container ' + classname);
			
			this.change_warning_height();
		},
		
		'.logo, .know_logo click': function(el) {
			$('html, body').scrollTop(0);
			
			ga('send', 'event', 'LogoClick');
		},
		
		'button.advices click': function(el) {
			$('html, body').scrollTop(0);
			
			ga('send', 'event', 'AdvicesClick');
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
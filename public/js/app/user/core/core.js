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
			
			this.classname = 'small';
			
			this.resize();
		},
		
		'{window} custom_ready': function() {
			$('body').css({
				overflow: 'auto'
			});
			
			$('#preloader').fadeOut(300);
		},
		
		'{window} custom_resize': 'resize',
		'{window} resize': 'resize',
		
		resize: function() {
			var wnd_width = this.window.width(),
				func = 'removeClass';
			
			if(wnd_width < 1160) {
				func = 'addClass';
			}
			
			this.main_container[func](this.classname);
		}
	}
);

new Core(document.body);

new Router(document.body, config.router);
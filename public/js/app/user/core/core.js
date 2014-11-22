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
			this.instruction_items = this.element.find('.instruction_container .item');
			
			this.active = 'active';
			this.small = 'small';
			
			this.resize();
			
			this.instruction_items.filter(':not(.active)').find('.text').hide();
		},
		
		'.instruction_container .item span, .instruction_container .item .arrow click': function(el) {
			var item  = el.closest('.item'),
				text = item.find('.text'),
				func = 'slideDown';
			
			if(item.hasClass(this.active)) {
				func = 'slideUp';
			}
			
			text.stop(true, false)[func](300);
			
			item.toggleClass(this.active);
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
		
		'{window} custom_resize': 'resize',
		'{window} resize': 'resize',
		
		resize: function() {
			var wnd_width = this.window.width(),
				func = 'removeClass';
			
			if(wnd_width < 1160) {
				func = 'addClass';
			}
			
			this.main_container[func](this.small);
		}
	}
);

new Core(document.body);

new Router(document.body, config.router);
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
			
			this.instruction_top_container = this.element.find('.instruction_top_container');
			this.instruction_title = this.instruction_top_container.find('.instruction_title');
			
			this.instruction_container = this.element.find('.instruction_container');
			this.instruction_items = this.instruction_container.find('.item');
			
			this.warning_container = this.element.find('.warning_container');
			
			this.active = 'active';
			this.small = 'small';
			
			this.resize();
			
			this.instruction_container.hide();
			this.instruction_items.filter(':not(.active)').find('.text').hide();
		},
		
		'.instruction_title click': function(el) {
			this.instruction_top_container.toggleClass(this.active);
			this.instruction_container.stop(true, false).slideToggle(300);
		},
		
		'.instruction_container .slide_up click': function() {
			this.instruction_top_container.removeClass(this.active);
			this.instruction_container.stop(true, false).slideUp(300);
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
		
		'{window} resize': 'resize',
		
		resize: function() {
			var wnd_width = this.window.width(),
				func = 'removeClass';
			
			if(wnd_width < 1200) {
				func = 'addClass';
			}
			
			this.main_container[func](this.small);
		},
		
		// custom
		
		'{window} custom_warning': function(el, ev, classname) {
			this.warning_container.removeClass();
			this.warning_container.addClass('warning_container ' + classname);
		}
	}
);

new Core(document.body);

new Router(document.body, config.router);
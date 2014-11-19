import Controller from 'controller';

import googlemaps_api from 'googlemaps_api'
import googlemaps_main from 'googlemaps_main'

export default Controller.extend(
	{
		defaults: {
			
		}
	}, {
		variables: function() {
			this.base_url = window.location.protocol + '//' + window.location.host;
			
			this.mapLatLng = new google.maps.LatLng(50.4300000, 30.389388);
			this.vishnevoeLatLng = new google.maps.LatLng(50.3856838, 30.3471481);
			
			this.instruction_items = this.element.find('.instruction_container .item');
			this.classname = 'active';
		},
		
		plugins: function() {
			this.init_map();
		},
		
		init_map: function() {
			var	options = {
					center: this.mapLatLng,
					zoom: 12
				};
			
			this.map = new google.maps.Map(document.getElementById('map'), options);
			
			this.draw_markers();
		},
		
		draw_markers: function() {
			new google.maps.Marker({
				position: this.vishnevoeLatLng,
				map: this.map,
				icon: this.base_url + '/img/user/1280/marker.png'
			});
		},
		
		after_init: function(data) {
			this.instruction_items.filter(':not(.active)').find('.text').hide();
		},
		
		'.instruction_container .item span, .instruction_container .item .arrow click': function(el) {
			var item  = el.closest('.item'),
				text = item.find('.text'),
				func = 'slideDown';
			
			if(item.hasClass(this.classname)) {
				func = 'slideUp';
			}
			
			text.stop(true, false)[func](300);
			
			item.toggleClass(this.classname);
		}
    }
);
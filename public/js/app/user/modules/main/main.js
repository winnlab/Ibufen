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
				icon: this.base_url + '/img/user/640/marker.png'
			});
		},
		
		after_init: function(data) {
			
		}
    }
);
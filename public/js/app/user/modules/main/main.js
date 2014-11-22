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
			
			this.pharmacy = [];
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
			
			this.get_locations();
			
			this.draw_markers();
		},
		
		get_locations: function() {
			if(!navigator.geolocation) {
				return console.error("Geolocation is not supported by this browser.");
			}
			
			navigator.geolocation.getCurrentPosition(function(position) {
				var data = {
					lat: position.coords.latitude,
					lon: position.coords.longitude
				}
				
				console.log(data)
			}, function(error) {
				console.error(error);
			});
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
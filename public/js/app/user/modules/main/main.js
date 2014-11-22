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
			
			this.get_locations();
		},
		
		get_locations: function() {
			if(!navigator.geolocation) {
				return console.error("Geolocation is not supported by this browser.");
			}
			
			var that = this;
			
			navigator.geolocation.getCurrentPosition(function(position) {
				var data = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				that.location_request(data);
			}, function(error) {
				console.error(error);
			});
			
			// var data = {
				// lat: 46.1858047,
				// lng: 30.3264845
			// };
			
			// that.location_request(data);
		},
		
		location_request: function(data) {
			var that = this;
			
			can.ajax({
				type: 'POST',
				url: '/pharmacy_near',
				data: data,
				success: function(data) {
					that.success_location_request(data.data);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.error(errorThrown);
				}
			});
		},
		
		success_location_request: function(data) {
			var i, latlng, pharm,
				bounds = new google.maps.LatLngBounds();
			
			for(i = data.pharmacy.length; i--;) {
				pharm = data.pharmacy[i];
				
				latlng = new google.maps.LatLng(pharm.loc[1], pharm.loc[0]);
				
				bounds.extend(latlng);
				
				new google.maps.Marker({
					position: latlng,
					map: this.map,
					icon: this.base_url + '/img/user/640/marker.png'
				});
			}
			
			this.map.fitBounds(bounds);
		},
		
		after_init: function(data) {
			
		}
    }
);
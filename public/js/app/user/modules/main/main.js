import Controller from 'controller';

import 'googlemaps_api'
import 'googlemaps_main'

export default Controller.extend(
	{
		defaults: {
			
		}
	}, {
		variables: function() {
			this.base_url = window.location.protocol + '//' + window.location.host;
			
			this.mapLatLng = new google.maps.LatLng(50.433, 30.517);
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
			
			var that = this,
				data = null,
				options = {
					enableHighAccuracy: true,
					timeout: 3000,
					maximumAge: 0
				};
			
			navigator.geolocation.getCurrentPosition(function(position) {
				data = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				
				that.location_request(data);
			}, function(error) {
				// that.location_request(data);
				console.error(error);
			}, options);
			
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
			
			if(data.lng && data.lat) {
				this.map.setCenter(new google.maps.LatLng(data.lng, data.lat));
			}
			
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
			
			if(bounds.length) {
				this.map.fitBounds(bounds);
			}
		},
		
		after_init: function(data) {
			
		}
    }
);
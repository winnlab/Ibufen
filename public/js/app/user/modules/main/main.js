import Controller from 'controller';

import 'googlemaps_api'
import 'googlemaps_main'

export default Controller.extend(
	{
		defaults: {
			
		}
	}, {
		bindings: function() {
			var that = this;
			
			this.element.on("custom_focus", function() {
				if(!that.element.hasClass('active')) {
					return false;
				}
				
				$(window).trigger('custom_warning', 'big');
			});
		},
		
		variables: function() {
			this.base_url = window.location.protocol + '//' + window.location.host;
			
			this.mapLatLng = new google.maps.LatLng(50.433, 30.517);
			
			this.fixed_topper = $('#fixed_topper');
			
			this.topper_container = this.element.find('.topper_container');
			this.video_container = this.element.find('.video_container');
			this.dragon_container = this.element.find('.dragon_container');
			this.safety_container = this.element.find('.safety_container');
			this.europe_container = this.element.find('.europe_container');
			
			this.instruction_button = this.element.find('button.instruction');
			this.instruction_container = this.element.find('.instruction_container');
			this.instruction_items = this.instruction_container.find('.item');
			
			this.active = 'active';
		},
		
		plugins: function() {
			this.init_map();
		},
		
		init_map: function() {
			var	options = {
					center: this.mapLatLng,
					zoom: 12,
					scrollwheel: false
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
				this.map.setCenter(new google.maps.LatLng(data.lat, data.lng));
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
			var that = this;
			
			this.instruction_container.hide();
			this.instruction_items.filter(':not(.active)').find('.text').hide();
		},
		
		'.topper_container .buy click': function() {
			var scrollTop = 	this.topper_container.height() +
							this.video_container.height() +
							this.dragon_container.height() +
							this.safety_container.height() +
							this.europe_container.height() -
							this.fixed_topper.height();
			
			$('html, body').stop().animate({
				scrollTop: scrollTop
			}, 1000);
		},
		
		'button.instruction click': function(el) {
			this.instruction_container.stop(true, false).slideToggle(300);
		},
		
		'.instruction_container .slide_up click': function() {
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
		}
    }
);
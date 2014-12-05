import Controller from 'controller';

import 'googlemaps_api'
import 'googlemaps_main'
// import 'youtube_iframe_api'

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
			
			this.window = $(window);
			this.main_container = $('#main_container');
			
			this.location_input = this.element.find('#location_input');
			
			this.topper_container = this.element.find('.topper_container');
			this.video_container = this.element.find('.video_container');
			this.dragon_container = this.element.find('.dragon_container');
			this.safety_container = this.element.find('.safety_container');
			this.europe_container = this.element.find('.europe_container');
			this.map_container = this.element.find('.map_container');
			
			this.instruction_button = this.element.find('button.instruction');
			this.instruction_container = this.element.find('.instruction_container');
			this.instruction_items = this.instruction_container.find('.item');
			
			this.up_arrow = this.element.find('.up_arrow');
			
			this.location_container = this.element.find('.location_container');
			
			this.active = 'active';
			
			this.referrer = decodeURI(document.location.href);
			
			this.scrolled_first_screen = false;
		},
		
		plugins: function() {
			this.init_map();
			// this.init_player();
		},
		
		sizes: function() {
			this.window_height = this.window.height();
			
			this.topper_container.height(this.window_height);
			
			this.topper_container_height = this.topper_container.height();
			this.video_container_height = this.video_container.height();
			this.dragon_container_height = this.dragon_container.height();
			this.safety_container_height = this.safety_container.height();
			this.europe_container_height = this.europe_container.height();
			this.map_container_height = this.map_container.height();
			this.fixed_topper_height = this.fixed_topper.height();
			
			if(this.main_container.hasClass('mini')) {
				this.up_arrow.hide();
			}
		},
		
		// init_player: function() {
			// var that = this;
			
			// function onYouTubeIframeAPIReady() {
				// this.player = new YT.Player('main_video', {
					// events: {
						// 'onReady': function(){
							// that.onPlayerStateChange();
						// },
						// 'onStateChange': function(){
							// that.onPlayerStateChange();
						// }
					// }
				// });
			// }
		// },
		
		// onPlayerStateChange: function() {
			// console.log(1)
		// },
		
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
					timeout: 1000,
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
				
				that.show_location_input();
				console.error(error);
			}, options);
			
			// var data = {
				// lat: 46.1858047,
				// lng: 30.3264845
			// };
			
			// that.location_request(data);
		},
		
		show_location_input: function() {
			var that = this;
			
			this.autocomplete = new google.maps.places.Autocomplete((document.getElementById('location_input')),
				{
					types: ['geocode']
				}
			);
			
			// google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
				// that.process_google_place();
			// });
			
			this.location_container.addClass(this.active);
		},
		
		// process_google_place: function() {
			// var place = this.autocomplete.getPlace();
			
			// console.log(place)
		// },
		
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
					that.show_location_input();
					console.error(errorThrown);
				}
			});
		},
		
		success_location_request: function(data) {
			var i, latlng, pharm,
				that = this,
				bounds = new google.maps.LatLngBounds();
			
			if(data.lng && data.lat) {
				this.map.setCenter(new google.maps.LatLng(data.lat, data.lng));
			}
			
			for(i = data.pharmacy.length; i--;) {
				(function(i) {
					pharm = data.pharmacy[i];
					
					latlng = new google.maps.LatLng(pharm.loc[1], pharm.loc[0]);
					
					bounds.extend(latlng);
					
					var marker = new google.maps.Marker({
						position: latlng,
						map: that.map,
						icon: that.base_url + '/img/user/640/marker.png'
					});
					
					var infowindow = new google.maps.InfoWindow({
						content:	'<div style="overflow:hidden;line-height:1.35;width:auto;min-width:200px;height:auto;min-height:80px;">' +
										'<div>' + 
											pharm.name +
										'</div>' +
										
										'<div>' + 
											pharm.city +
										'</div>' +
										
										'<div>' + 
											pharm.address +
										'</div>' +
									'</div>'
					});
					
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(that.map, marker);
					});
				})(i);
			}
			
			if(bounds.length) {
				this.map.fitBounds(bounds);
			}
			
			this.location_container.removeClass(this.active);
		},
		
		after_init: function(data) {
			var that = this;
			
			this.check_up_arrow(this.window);
			
			this.instruction_container.hide();
			this.instruction_items.filter(':not(.active)').find('.text').hide();
		},
		
		'.topper_container .buy click': function(el) {
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'NearestPharmacy', 'Click');
			
			this.scroll_to_map();
		},
		
		scroll_to_map: function() {
			var scrollTop = 	this.topper_container_height +
							this.video_container_height +
							this.dragon_container_height +
							this.safety_container_height +
							this.europe_container_height -
							this.fixed_topper_height;
			
			$('html, body').stop().animate({
				scrollTop: scrollTop
			}, 1000);
		},
		
		'button.instruction click': function(el) {
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'Instruction', 'Click');
			
			var func = 'slideUp',
				visible = this.instruction_container.css('display') == 'block',
				scrollTop = 	this.topper_container_height +
							this.video_container_height +
							this.dragon_container_height +
							this.safety_container_height +
							this.europe_container_height +
							this.map_container_height -
							this.fixed_topper_height;
			
			if(!visible) {
				func = 'slideDown';
				
				$('html, body').stop().animate({
					scrollTop: scrollTop
				}, 500);
			}
			
			this.instruction_container.stop(true, false)[func](300);
		},
		
		'.instruction_container .slide_up click': function() {
			this.instruction_container.stop(true, false).slideUp(300);
		},
		
		'.instruction_container .item click': function(el) {
			var text = el.find('.text'),
				func = 'slideDown';
			
			if(el.hasClass(this.active)) {
				func = 'slideUp';
			}
			
			text.stop(true, false)[func](300);
			
			el.toggleClass(this.active);
		},
		
		'.up_arrow click': function(el) {
			$('html, body').scrollTop(0);
			
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'UpArrow', 'Click');
		},
		
		'.vimeo click': function(el) {
			console.log(el)
		},
		
		'.map_container .find click': function(el) {
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'Find', 'Click');
			
			var data = {
				address: this.location_input.val()
			};
			
			this.location_request(data);
		},
		
		'{window} scroll': function(el, ev) {
			if(!this.element.hasClass(this.active)) {
				return;
			}
			
			this.check_up_arrow(this.window, ev);
			this.check_first_screen(this.window, ev);
		},
		
		check_first_screen: function(el, ev) {
			if(this.scrolled_first_screen) {
				return;
			}
			
			var scroll_top = el.scrollTop();
			
			if(scroll_top >= this.topper_container_height) {
				ga('set', 'page', this.referrer);
				ga('send', 'event', 'FirstScreen', 'Scrolled');
				
				this.scrolled_first_screen = true;
			}
		},
		
		check_up_arrow: function(el, ev) {
			if(this.main_container.hasClass('mini')) {
				this.up_arrow.hide();
				return;
			}
			
			var scroll_top = el.scrollTop(),
				comparison = this.topper_container_height +
							this.video_container_height -
							this.window_height,
				func = 'show';
			
			if(scroll_top < comparison) {
				func = 'hide';
			}
			
			this.up_arrow[func]();
		}
    }
);
import Controller from 'controller';

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
				
				// $(window).trigger('custom_warning', 'small');
				
				$('html, body').scrollTop(0);
			});
		},
		
		variables: function() {
			this.help_containers = this.element.find('.help_container');
			
			this.active = 'active';
			
			this.referrer = decodeURI(document.location.href);
		},
		
		plugins: function() {
			
		},
		
		after_init: function(data) {
			this.help_containers.hide();
		},
		
		'.how_to_help click': function(el) {
			var id = el.data('id'),
				help_container  = this.help_containers.filter('.help_container_' + id);
			
			help_container.stop(true, false).slideToggle(300);
			help_container.toggleClass(this.active);
			el.toggleClass(this.active);
		},
		
		'.topper_container_1 .how_to_help click': function(el) {
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'PinkHelp', 'Click');
		},
		
		'.topper_container_2 .how_to_help click': function(el) {
			ga('set', 'page', this.referrer);
			ga('send', 'event', 'PaleHelp', 'Click');
		}
    }
);
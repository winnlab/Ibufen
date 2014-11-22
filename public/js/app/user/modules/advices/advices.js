import Controller from 'controller';

export default Controller.extend(
	{
		defaults: {
			
		}
	}, {
		variables: function() {
			this.help_containers = this.element.find('.help_container');
			
			this.active = 'active';
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
		}
    }
);
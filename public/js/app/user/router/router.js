import $ from 'jquery'
import can from 'can/'
import 'can/route/pushstate/'
import _ from 'underscore'

import Placeholder from 'placeholder'

export default can.Control.extend({
		defaults: {
			
		}
	}, {
		init: function (el, options) {
			this.route = false;
			
			this.Placeholder = new Placeholder();
			
			var html = can.view('#route_mustache', {
					modules: this.Placeholder.attr('modules')
				}),
				self = this;
			
			$(options.modulesContainer).prepend(html);
			
			if(!can.route.bindings.pushstate) {
				var href = location.href.split(options.base).slice(3).join('/'),
					hrefLastChar = href.length - 1;
				
				if(href[hrefLastChar] == '/') {
					href = href.substr(0, hrefLastChar); // remove ending slash
				}
				
				return this.new_module(href);
			}
			
			can.route.bindings.pushstate.root = options.base;
			can.route.ready();
		},
		
		'.new_module click': function (el, ev) {
			if(!can.route.bindings.pushstate) {
				return;
			}
			
			ev.preventDefault();
			
			var options = this.options,
				href = el.attr('href').split(options.base).slice(1).join('/');
			
			this.new_module(href);
		},
		
		'new_module': function(href) {
			var routeObj = can.route.deparam(href);
			
			try {
				if (!_.isEmpty(routeObj)) {
					can.route.attr(routeObj, true);
				} else {
					throw new  Error("There is no such routing rule for '" + href + "', please check your configuration file");
				}
			} catch (e) {
				console.error(e);
			}
		},

		'/ route': 'routeChanged',
		':module route': 'routeChanged',
		':module/:id route': 'routeChanged',
		':module/:id/:param2 route': 'routeChanged',
		
		routeChanged: function (data) {
			var moduleName,
				id,
				module;
			
			if(!data.module) {
				data.module = this.options.defaultModule;
			}
			
			moduleName = data.module;
			
			id = moduleName + (data.id ? '-' + data.id : '') + (data.param2 ? '-' + data.param2 : '');
			
			if(this.route === id) {
				return;
			}
			
			this.route = id;
			
			module = _.find(this.options.modules, function (module) {
				return module.name === moduleName
			});
			
			try {
				if(module) {
					module.id = id;
					module.entity_id = data.id;
					module.param2 = data.param2;
					
					if(typeof(module.fake_path) != 'undefined') {
						ga('send', 'pageview', '/' + module.name);
						return can.route.attr({module: module.fake_path}, true);
					}
					
					this.Placeholder.initModule(module);
				} else {
					throw new Error("There is no '" + moduleName + "' module, please check your configuration file");
				}
			} catch (e) {
				console.error(e);
			}
		}
	});
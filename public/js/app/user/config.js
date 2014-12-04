System.config({
	baseURL: '/',
	paths: {
		'jquery': 'js/plugins/jquery/dist/jquery.min.js',
		'can/*': 'js/plugins/CanJS/*.js',
		'underscore': 'js/plugins/underscore/underscore-min.js',
		'jade': 'js/plugins/jade/runtime.js',
		// 'select2': 'js/plugins/select2/select2.js',
		'knob': 'js/plugins/jquery-knob/dist/jquery.knob.min.js',
		'googlemaps_api': 'js/plugins/google/googlemaps_api.js',
		'googlemaps_main': 'js/plugins/google/googlemaps_main.js',
		// 'moment': 'js/plugins/moment/moment.js',
		'router': 'js/app/user/router/router.js',
		'placeholder': 'js/app/user/router/placeholder.js',
		
		'core': 'js/app/user/core/core.js',
		'core/*': 'js/app/user/core/*.js',
		'lib/*': 'js/app/user/lib/*.js',
		'modules/*': 'js/app/user/modules/*.js',
		
		'rConfig': 'js/app/user/core/config.js',
		'helpers': 'js/app/user/helpers.js',
		
		// 'bx-slider': 'js/plugins/bx-slider/jquery.bxslider.min.js',
		
		'controller': 'js/app/user/lib/controller/controller.js',
		'module/*': 'js/app/user/modules/*.js',
		
		'lodash': 'js/plugins/lodash/dist/lodash.js'
	},
	map: {
		'can/util/util': 'can/util/jquery/jquery',
		'jquery/jquery': 'jquery',
		'$': 'jquery'
	},
	meta: {
		'can/*': {
			deps: [
				'jquery',
				'can/route/pushstate/pushstate'
			]
		},
		'core': {
			deps: [
				'jquery',
				'can/',
				'router',
				'rConfig',
				'helpers',
				'controller'
			]
		},
		'helpers': {
			deps: [
				'jade'
			]
		}
	},
	ext: {
		mustache: 'can/view/mustache/system'
	}
});

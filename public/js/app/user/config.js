(function () {
	'use strict';
	// taking from HTML5 Shiv v3.6.2 |
	// @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
	var supportsUnknownElements = false;

	(function () {
		try {
			var a = document.createElement('a');
			a.innerHTML = '<xyz></xyz>';

			supportsUnknownElements = a.childNodes.length === 1 || (function () {
				// assign a false positive if unable to shiv
				(document.createElement)('a');
				var frag = document.createDocumentFragment();
				return (
					typeof frag.cloneNode === 'undefined' ||
						typeof frag.createDocumentFragment === 'undefined' ||
						typeof frag.createElement === 'undefined'
					);
			}());
		} catch (e) {
			// assign a false positive if detection fails => unable to shiv
			supportsUnknownElements = true;
		}
	}());
	
	System.config({
		baseURL: '/',
		map: {
			'can/util/util': 'can/util/jquery/jquery',
			'jquery/jquery': 'jquery',
			'$': 'jquery'
		},
		paths: {
			'can/*': 'js/plugins/CanJS/*.js',
			'jquery': 'js/plugins/jquery/dist/jquery.min.js',
			'underscore': 'js/plugins/underscore/underscore-min.js',
			'jade': 'js/plugins/jade/runtime.js',
			// 'select2': 'js/plugins/select2/select2.js',
			'knob': 'js/plugins/jquery-knob/dist/jquery.knob.min.js',
			'googlemaps_api': 'js/plugins/google/googlemaps_api.js',
			'googlemaps_main': 'js/plugins/google/googlemaps_main.js',
			// 'youtube_iframe_api': 'js/plugins/youtube/iframe_api.js',
			// 'moment': 'js/plugins/moment/moment.js',
			
			'router': 'js/app/user/router/router.js',
			'placeholder': 'js/app/user/router/placeholder.js',
			
			'core': 'js/app/user/core/core.js',
			'core/*': 'js/app/user/core/*.js',
			'lib/*': 'js/app/user/lib/*.js',
			'module/*': 'js/app/user/modules/*.js',
			'modules/*': 'js/app/user/modules/*.js',
			
			'rConfig': 'js/app/user/core/config.js',
			'helpers': 'js/app/user/helpers.js',
			
			// 'bx-slider': 'js/plugins/bx-slider/jquery.bxslider.min.js',
			
			'controller': 'js/app/user/lib/controller/controller.js',
			
			'lodash': 'js/plugins/lodash/dist/lodash.js'
		},
		meta: {
			'jquery': {
				exports: "$",
				deps: supportsUnknownElements ? undefined : ["can/lib/html5shiv.js"]
			},
			'can/*': {
				deps: [
					'jquery',
					'can/route/pushstate/pushstate'
				]
			},
			'helpers': {
				deps: [
					'jade'
				]
			},
			jade: {
				format: 'global',
				deps: [
					'jquery'
				]
			}
		},
		ext: {
			css: 'js/plugins/steal/css',
			mustache: "js/plugins/CanJS/view/mustache/system",
		},
		bundle: [
			"modules/advices/advices",
			"modules/main/main"
		]
	});
})();

System.buildConfig = {map: {"can/util/util" : "can/util/domless/domless"}};
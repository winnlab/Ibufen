System.config({
	baseURL: '/',
	paths: {
		'css-admin/*': 'css/admin/*css',
		'jquery': 'js/plugins/jquery/dist/jquery.min.js',
		'can/*': 'js/plugins/CanJS/*.js',
		'adminlte': 'js/plugins/adminlte/js/AdminLTE/app.js',
		'bootstrap': 'js/plugins/adminlte/js/bootstrap.min.js',
		'slimscroll': 'js/plugins/adminlte/js/plugins/slimScroll/jquery.slimscroll.min.js',
		'iCheck': 'js/plugins/adminlte/js/plugins/iCheck/icheck.min.js',
		'velocity': 'js/plugins/velocity/velocity.min.js',
		'velocity-ui': 'js/plugins/velocity/velocity.ui.min.js',
		'underscore': 'js/plugins/underscore/underscore-min.js',
		'lodash': 'js/plugins/lodash/dist/lodash.min.js',
		'swal': 'js/plugins/sweetalert/lib/sweet-alert.min.js',
		'summernote': 'js/plugins/summernote/dist/summernote.min.js',
		'sortable': 'js/plugins/html5sortable/jquery.sortable.js',
		'cropper': 'js/plugins/cropper/dist/cropper.min.js',

		'adminlte-css/*': 'js/plugins/adminlte/css/*css',

		'router': 'js/app/admin/router/router.js',
		'placeholder': 'js/app/admin/router/placeholder.js',

		'core': 'js/app/admin/core/core.js',
		'appState': 'js/app/admin/core/appState.js',
		'rConfig': 'js/app/admin/core/config.js',

		'list': 'js/app/admin/lib/list/list.js',
		'edit': 'js/app/admin/lib/edit/edit.js',
		'baseModel': 'js/app/admin/lib/model/baseModel.js',

		'upload' : 'js/app/admin/components/upload/upload.js',
		'articlefilter': 'js/app/common/components/articlefilter/articlefilter.js',
		'pagination': 'js/app/admin/components/pagination/pagination.js',
		'slider': 'js/app/common/components/slider/slider.js'
	},
	map: {
		'can/util/util': 'can/util/jquery/jquery',
		'jquery/jquery': 'jquery',
		'$': 'jquery'
	},
	ext: {
		css: 'js/plugins/steal/css',
		stache: 'can/view/stache/system'
	},
	meta: {
		cropper: {
			format: 'global',
			deps: [
				'jquery',
				'js/plugins/cropper/dist/cropper.min.css!'
			]
		},
		sortable: {
			format: 'global',
			deps: [
				'jquery',
				'bootstrap'
			]
		},
		summernote: {
			format: 'global',
			deps: [
				'jquery',
				'bootstrap',
				'js/plugins/summernote/dist/summernote-bs3.css!',
				'js/plugins/summernote/dist/summernote.css!',
				'can/',
				'can/view/mustache/'
			]
		},
		swal: {
			exports: 'swal',
			format: 'global',
			deps: [
				'js/plugins/sweetalert/lib/sweet-alert.css!'
			]
		},
		'can/*': {
			deps: [
				'jquery',
				'can/route/pushstate/pushstate'
			]
		},
		slimscroll: {
			format: 'global',
			deps: ['jquery']
		},
		bootstrap: {
			format: 'global',
			deps: ['jquery']
		},
		adminlte: {
			format: 'global',
			deps: [
				'jquery',
				'bootstrap',
				'iCheck',
				'slimscroll',
				'adminlte-css/AdminLTE.css!',
				'adminlte-css/ionicons.min.css!',
				'adminlte-css/bootstrap.min.css!'
			]
		}
	}
});
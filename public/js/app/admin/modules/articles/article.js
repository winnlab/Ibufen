import 'can/'
import 'can/view/'
import 'can/view/mustache/'
import Edit from 'edit'
import 'upload'
import appState from 'appState'
import _ from 'lodash'

import 'cropper'
import 'slider'
import 'summernote'
import 'sortable'

import GalleryModel from 'js/app/admin/modules/articles/galleryModel'

export default Edit.extend({
    defaults: {
        viewpath: '/js/app/admin/modules/articles/views/',

        moduleName: 'article',

        successMsg: 'Статья успешно сохранена.',
        errorMsg: 'Ошибка сохранения статьи.',

        removeAnswerMsg: 'Удалить ответ?',

        form: '.setArticle'
    }
}, {

	init: function(element, options) {
		_.extend(this.options, options);

		var self = this,
			options = this.options,
			gallery = new can.Map;

		self.module = new can.Map({
			langs: appState.attr('langs')
		});

		if (!options.doc.attr('_id')) {
            can.ajax({
                url: `/admin/article/maxpos`
            }).always((response) => {
                var pos = response.data && response.data.max || 0;
                options.doc.attr('position', pos + 1);
            });
		};

		self.ensureObject(options.doc, 'desc');
		self.ensureObject(options.doc, 'age', []);
		self.ensureObject(options.doc, 'theme', []);
		self.ensureObject(options.doc, 'type');
		self.ensureObject(options.doc, 'image');
		
		self.module.attr(options.moduleName, options.doc);

		self.module.attr('ages', options.ages);
		self.module.attr('themes', options.themes);
		self.module.attr('types', options.types);

		var ageValue = [],
			themeValue = [];

		self.module.attr(options.moduleName + '.age').each(function (item) {
			ageValue.push(item._id);
		});

		self.module.attr(options.moduleName + '.theme').each(function (item) {
			themeValue.push(item._id);
		});

		self.module.attr('ageValue', ageValue);
		self.module.attr('themeValue', themeValue);

		if (options.doc) {
			if (options.doc.attr('_id')) {
				gallery = new GalleryModel.List({article_id: options.doc.attr('_id')});
			}
		}

		self.module.attr('gallery', gallery);
		self.module.attr('module', {gallery: self.module.attr('gallery')});

		self.module.attr('newGalleryName', '');
		self.module.attr('addingGallery', false);
		self.module.attr('showCroppers', false);
		self.module.attr('cropSizes', [
			{size: 'B', name: 'Фоновое изображение', ratio: 2.4, w: 1850, h: 800},
			{size: 'S', name: 'Малое изображение (S)', ratio: 0.96, w: 290, h: 303},
			{size: 'L', name: 'Большое изображение (L)', ratio: 1.91, w: 580, h: 303},
			{size: 'XL', name: 'Экстра большое изображение (XL)', ratio: 0.96, w: 580, h: 606}
		]);

		self.loadView(options.viewpath + options.viewName, self.module);
	},

	ensureObject: function(obj, key, value = {}) {
		if (!_.isObject(obj.attr(key))) {
			obj.attr(key, value);
		}
	},

	'.currentAgeSelect change': function (el) {

		var ages = this.module.attr(this.options.moduleName + '.age'),
			newAgeValue = [];

		if (ages instanceof can.List) {
			ages.replace([]);
		} else {
			ages = new can.List;
			this.module.attr(this.options.moduleName + '.age', ages);
		}

		el.find('option:selected').each(function () {
			var data = $(this).data('ages');
			ages.push({
				_id: data.attr('_id'),
				title: data.attr('title'),
				fixture: data.attr('icon.fixture')
			});
			newAgeValue.push(data._id);
		});

		this.module.attr('ageValue', []);
		this.module.attr('ageValue', newAgeValue);
	},

	'.currentThemeSelect change': function (el) {
		var self = this,
			themes = self.module.attr(self.options.moduleName + '.theme'),
			newThemes = [];

		if (! themes instanceof can.List) {
			themes = new can.List;
			self.module.attr(self.options.moduleName + '.theme', themes);
		}

		el.find('option:selected').each(function () {
			var data = $(this).data('themes');
			newThemes.push({
				_id: data.attr('_id'),
				name: data.attr('name')
			});
		});

		var toRemove = [];
		themes.each((item, index) => {
			var newItem = _.detect(newThemes, {_id: item._id});
			if (newItem) {
				var idx = _.findIndex(newThemes, {_id: newItem._id});
				newThemes.splice(idx, 1);
			} else {
				toRemove.push(index);
			}
		});

		_.eachRight(toRemove, (index) => {
			themes.splice(index, 1);
		});

		_.each(newThemes, (item) => {
			can.ajax({
				url: `/admin/theme/maxpos/${item._id}`
			}).always((response) => {
				var pos = response.data && response.data.max || 0;

				themes.push({
					_id: item._id,
					name: item.name,
					position: pos + 1
				});
			});
		});
	},

	'.addAnswer click': function (el) {
		var answers = this.options.doc.attr('answer');
		if(!answers) {
			this.options.doc.attr('answer', new can.List);
			answers = this.options.doc.attr('answer');
		}
		answers.push({text: '', score: 0});
	},

	'.removeAnswer click': function (el) {
		if (confirm(this.options.removeAnswerMsg)) {
			var item = $(el).parents('.answer').data('answer'),
				answ = this.options.doc.attr('answer'),
				index = answ.indexOf(item);

			if(index > -1) {
				answ.splice(index, 1);
			}
		}
	},

	'.addGallery click': function () {
		this.module.attr('addingGallery', !this.module.attr('addingGallery'));
	},

	'.confirmGallery click': function () {
		var self = this,
			options = self.options;

		var doc = new GalleryModel({
			article_id: options.doc.attr('_id'),
		    name: self.module.attr('newGalleryName'),
		    images: []
		});

		doc.save()
		    .done(function (response) {
		    	doc.attr('_id', response._id);

		        self.module.attr('gallery').push(doc);

		        swal('Галерея создана!', '', 'success');

		        self.resetObservables();
		    })
		    .fail(function (response) {
		    	var data = response.responseJSON.err;
		    	self.processError(data.err);
		    });
	},

	'.removeGallery click': function (el) {
		swal({
		    title: "Удалить галерею?",
		    text: "",
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "Продолжай!",
		    cancelButtonText: "Нет!",
		    closeOnConfirm: false,
		    closeOnCancel: true
		}, function (isConfirm) {
		    if (isConfirm) {
		        $(el).parents('.gallery').data('gallery').destroy();
		        swal("Галерея удалена!", "", "success");
		    }
		});
	},

	resetObservables: function () {
		this.module.attr('addingGallery', false);
		this.module.attr('newGalleryName', '');
	},

	'.galleryName change': function (el) {
		$(el).parents('.gallery').data('gallery').save();
	},

	'.croppers click': function () {
		this.module.attr('showCroppers', !this.module.attr('showCroppers'));
	},

	'.cropImage click': function (el) {
		var self = this,
			moduleName = self.options.moduleName,
			wrap = el.closest('.cropper-wrap'),
			prefix = wrap.data('prefix'),
			data = {
				data: wrap.find('.croppedImage').cropper('getData'),
				prefix,
				id: self.module.attr(`${moduleName}._id`)
			};

			data.data.imgWidth = wrap.data('w');
			data.data.imgHeight = wrap.data('h');

		can.ajax({
			url: '/admin/article/crop',
			method: 'POST',
			data
		}).done(function (response) {
			self.module.attr(`${moduleName}.image.${prefix}`, `${response.data.filename}?${new Date().getTime()}`);
			self.module.attr(`${moduleName}.image.data${prefix}`, response.data.data);
			self.module.attr(`${moduleName}.__v`, response.data.__v);

			saSuccess('Изображение успешно обрезано.');

		}).fail(self.processError);
	},

	'.removeCropped click': function (el) {
		var self = this,
			moduleName = self.options.moduleName,
			prefix = el.closest('.cropper-wrap').data('prefix').toUpperCase(),
			data = {
				prefix,
				id: self.module.attr(`${moduleName}._id`)
			};

		can.ajax({
			url: '/admin/article/crop',
			method: 'DELETE',
			data
		}).done(function (response) {
			self.module.attr(`${moduleName}.image.${prefix}`, null);
			self.module.attr(`${moduleName}.__v`, response.data.__v);

			saSuccess('Изображение успешно удалено.');

		}).fail(self.processError);
	}

});
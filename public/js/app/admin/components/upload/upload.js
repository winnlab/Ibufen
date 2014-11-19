import 'can/'
import 'can/map/sort/'
import appState from 'appState'
import _ from 'lodash'

import 'css/admin/components/upload.css!'
import 'js/plugins/jquery-form/jquery.form'

var UploadViewModel = can.Map.extend({
	// url - upload action
	'url': '@',
	// delete-url - action to delete uploaded file
	'delete-url': '@',
	// accept - mime types of upload files
	'accept': '@',
	'name': '@',
	'multiple': '@',
	'sortable': null,
	'parentname': '@',
	'showurl': '@',
	'nested': null,
	'files': [],
	'progress': 0,

	define: {
		'uploadId': {
			value: function () {
				var result = 'uploader-' + Math.ceil(Math.random() * 1000);
				return result;
			}
		},
		'uploaded': {
			set: function (newVal) {
				var uploaded = new can.List([]),
					files = this.attr('files');

				files.replace([]);
				if (newVal) {
					if (this.attr('multiple')) {
                        if (typeof newVal === 'string') {
                            uploaded.push(newVal);
                        } else {
                            uploaded.replace(newVal);
                        }
					} else {
						var realVal = newVal.data
							? newVal.data[this.attr('name')] || newVal
							: newVal;

						uploaded.push(realVal);
					}
				}

				return uploaded;
			}
		}
	},

	upload: function (form) {
		var self = this,
			files = self.attr('files'),
			name = self.attr('name') + (self.attr('multiple') ? '[]' : ''),
			entity = self.attr('entity'),
			entity_id = entity.attr('id') || entity.attr('_id'),
			options;

		if (files.length && entity_id) {
			options = {
				data: {
					name: name,
					id: entity_id
				},
				beforeSend: function() {
					self.attr('progress', 0);
				},
				uploadProgress: function(event, position, total, percentComplete) {
					self.attr('progress', percentComplete);
				},
				success: function() {
					self.attr('progress', 100);
				}
			};

			if (self.attr('nested')) {
				options.data.nestedId = self.attr('nested');
			}
			
			var formSubmited = form.ajaxSubmit(options);
			var xhr = formSubmited.data('jqxhr');

			xhr.done(function (response) {

				var data = response.data || response.responseJSON && response.responseJSON.data;
				if (entity.uploaded) {
					entity.uploaded(data.fileName || self.attr('name'), data[self.attr('name')] || data);
				}

				saSuccess('Файл успешно выгружен.');

				self.attr('progress', 0);

			}).fail(function (response) {
				var msg =  response.responseJSON
					? response.responseJSON.err
					: 'Ошибка выгрузки файла.';
				saError(msg);
			});
		} else if (files.length) {
			saError('Ошибка идентификации связи файла.');
		}
	},

	remove: function (sourceName) {
		var self = this,
			uploaded = self.attr('uploaded'),
			name = self.attr('name'),
			entity = self.attr('entity'),
			sourceIndex = uploaded.indexOf(sourceName);

		can.ajax({
			url: self.attr('delete-url'),
			data: {
				name: name,
				sourceName: sourceName,
				id: self.attr('entity.id') || self.attr('entity._id'),
				nestedId: self.attr('nested') || null
			},
			type: 'DELETE'
		}).done(function (response) {
			uploaded.splice(sourceIndex, 1);

			if (entity.removeUploaded) {
				entity.removeUploaded(name, sourceIndex, response);
			}

			saSuccess('Удалено!', 'Удаление выполнено успешно.');
		}).fail(function (data) {
			saError(data.responseJSON.err || 'Проверьте соединение с интернетом.')
		});
	}
});

var initSortable = function (el, scope) {
	var wrap = $(el);

	wrap.sortable('destroy');

	wrap.sortable({
		items: '.image-item'
	}).bind('sortupdate', function() {
		var newOrder = [];
		wrap.find('.image-item').each(function () {
			newOrder.push($(this).data('name'));
		});

		var name = scope.attr('parentname');

		var doc = $(this).parents('.' + name).data(name);

		doc.attr(scope.attr('name')).sort(function(a, b) {
			return newOrder.indexOf(a) > newOrder.indexOf(b);
		});

		doc.save();
	})
};

can.Component.extend({
	tag: "upload",
	scope: UploadViewModel,
	template: can.view('/js/app/admin/components/upload/views/upload.stache'),
	events: {
		inserted: function (el) {
			var scope = this.scope,
				wrap = el.find('.uploadedWrap');

			if (this.scope.attr('sortable')) {
				_.defer(initSortable, wrap, scope);

				this.scope.bind('uploaded', function (ev, newVal, oldVal) {
					if (newVal.attr('length') > oldVal.attr('length')) {
						_.defer(initSortable, wrap, scope);
					}
				});
			}
		},
		'input change': function (el, ev) {
			var scope = this.scope,
				scopeFiles = scope.attr('files'),
				files = el[0].files;
			
			scopeFiles.replace(files);
			scope.upload(el.parents('form'));
		},
		'.remove click': function (el, ev) {
			var self = this;

			saConfirm(
				"Удалить?", 
				"Вы действительно хотите удалить этот файл?", 
				function (isConfirm) {
					if (isConfirm) {
						self.scope.remove(el.data('uploaded'));
						swal("Удалена!", "Изображение успешно удалено.", "success");
					}
				}
			);
		}
	},
	helpers: {
		isDeleteBtn: function (options) {
			var files = this.attr('uploaded');
			return this.attr('delete-url') && files.length
				? options.fn() 
				: options.inverse();
		},
		makeSortable: function (uploaded) {
			var self = this;

			return function (el) {
				_.defer(initSortable, el, self);
			}
		}
	}
});
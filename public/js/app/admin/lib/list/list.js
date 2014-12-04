import 'can/'
import 'can/route/'
import 'can/view/'
import 'can/map/define/'
import 'can/list/promise/'
import appState from 'appState'

import 'swal'

export default can.Control.extend({
	defaults: {
		viewpath: '',
		viewName: 'index.stache',

		// Edit entity controller
		Edit: function () {},
		// Name for list entity in view
		moduleName: false,
		// Link to entity constructor model
		Model: can.Model,

		successMsg: 'Сущность успешно сохранена.',
        errorMsg: 'Ошибка сохранения сущности.',
		deleteMsgTitle: 'Удаление',
		deleteMsg: 'Вы действительно хотите удалить эту сущность?',
		deletedMsg: 'Сущность успешно удалена',
		deletedErr: 'Ошибка удаления сущности',

		// Selectors
		add: false,//'.add',
		edit: false,//'.edit',
		remove: false,//'.remove',
		toList: '.toList',
		// Selector for entity form block wrap
		formWrap: false,//'.formWrap',
		// Entity selector wich rich with #data view helper
		parentData: false,//'.entity'
	}
}, {
	setup: function (element, options) {

		var cls = this.constructor,
			pluginname = cls.pluginName || cls._fullName,
			arr;

		this.element = can.$(element);

		if (pluginname && pluginname !== 'can_control') {
			this.element.addClass(pluginname);
		}

		arr = can.data(this.element, 'controls');
		if (!arr) {
			arr = [];
			can.data(this.element, 'controls', arr);
		}
		arr.push(this);

		this.options = can.extend({}, cls.defaults, options);

		this.defineSelectors();

		this.on();

		return [this.element, this.options];
	},

	init: function () {

		var self = this,
			options = self.options,
			route = can.route.attr();

		self.defineModule();

		self.populateModel();

		self.loadView();

		if (route.entity_id && route.action) {
			self.module.attr('display', 'set');
			can.when(
				self.module.attr(options.moduleName)
			).then(function () {
				self.setDocCallback(route.entity_id);
			});
		}

	},

	defineSelectors: function () {
		var o = this.options;

		if (typeof o.moduleName !== 'string' || o.moduleName.length === 0) {
			throw new Error("`moduleName` not defined or defined as not a String value.")
		}

		var moduleNameLow = o.moduleName,
			len = moduleNameLow.length;

		if (moduleNameLow[len - 1] === 's') {
			moduleNameLow = moduleNameLow[len - 2] === 'e'
				? moduleNameLow.substr(0, len - 2)
				: moduleNameLow.substr(0, len - 1);
		}

		var moduleNameUp = moduleNameLow[0].toUpperCase() + moduleNameLow.substr(1),
			shortcuts = [ 'add', 'edit', 'remove' ];

		for (var i = 0, len = shortcuts.length; i < len; i++) {
			var shortcut = shortcuts[i];
			if (!this.isValidString(o[shortcut])) {
				o[shortcut] = '.' + shortcut + moduleNameUp;
			}
		}

		if (!this.isValidString(o.formWrap)) {
			o.formWrap = '.' + moduleNameLow + 'Form';
		}

		if (!this.isValidString(o.parentData)) {
			o.parentData = '.' + moduleNameLow;
		}
	},

	defineModule: function () {
		this.module = new can.Map({
			display: 'list'
		});
	},

	loadView: function () {
		this.element.html(can.view(this.options.viewpath + this.options.viewName, this.module));
	},

	populateModel: function () {
		this.module.attr(this.options.moduleName, new this.options.Model.List({}));
	},

	/*
	 * Routes
	 */

	':module route': function (data) {
		if (data.module === this.options.moduleName) {
			this.toListCallback();
		}
	},

	':module/:action/:entity_id route': function (data) {
		if (data.module === this.options.moduleName) {
			this.setDocCallback(data.entity_id);
		}
	},

	'{add} click': function () {
		this.setDoc();
	},

	'{edit} click': function (el) {
		var doc = this.getDocHandle(el);

		this.setDoc(doc.attr('_id'));
	},

	setDoc: function (id) {
		can.route.attr({
			entity_id: id || '0',
			action: 'set'
		});
	},

	setDocCallback: function (id) {

		this.module.attr('display', 'set');

		if (this.module.attr('setEntity')
			&& this.module.attr('setEntity')() === id) {
			return;
		}

		var options = this.options,
			wrap = this.element.find(options.formWrap),
			doc = _.find(this.module.attr(options.moduleName), function (doc) {
				return doc && doc.attr('_id') === id;
			});

		this.module.attr('setEntity', can.compute(id));

		this.initSetControl(
			wrap,
			doc ? doc : new options.Model(),
			this.module.attr('setEntity')
		);
	},

	initSetControl: function (area, doc, entity) {
		area.html('');

		var params = {
			doc,
			entity
		};

		if (this.options.EditHandle) {
            this.options.EditHandle.destroy();
        }
        
        this.options.EditHandle = new this.options.Edit(area, params);
	},

	'{toList} click': function () {
		can.route.attr({
			entity_id: undefined,
			action: undefined
		});
	},

	toListCallback: function () {
		this.module.attr({
			'display': 'list'
		});
	},

	'{remove} click': function (el) {
		var options = this.options,
			doc = this.getDocHandle(el);

		swal({
			title: options.deleteMsgTitle,
			text: options.deleteMsg,
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			confirmButtonText: 'Да',
			cancelButtonText: 'Нет',

		}, function(isConfirm) {
			if (isConfirm) {
				doc.destroy().always(function (doc, status, def) {
					appState.attr('notification', {
						status: status,
						msg: status === 'success'
							? options.deletedMsg
							: options.deletedErr
					});
				});
			}
		})
	},

	'{Model} created': function (Model, ev, doc) {
		var self = this,
			docs = self.module.attr(self.options.moduleName);

		docs.push(doc);
	},

    processError: function (err) {
        var msg;

        if(err.errors && err.errors.title) {
            msg = err.errors.title.message;
        }

        if(!msg) {
            msg = err.message || err;
        }

        this.setNotification('error', msg);
    },

    getDocHandle: function (el) {
    	return el
    		.closest(this.options.parentData)
            .data(this.options.moduleName);
    },

    setNotification: function (status, msg) {
        appState.attr('notification', {
            status: status,
            msg: msg
        });
    },

    isValidString: function (s) {
    	return typeof s === 'string' && s.length > 0;
    }
});
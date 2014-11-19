import 'can/'
import appState from 'appState'
import _ from 'lodash'

export default can.Control.extend({
	defaults: {
		viewpath: '',
        viewName: 'set.stache',
		moduleName: 'doc',
		successMsg: 'Сущность успешно сохранена.',
		errorMsg: 'Ошибка сохранения сущности.',
        // Selectors
		form: '',
		// is change entityId param in can.route
		setRoute: true
	}
}, {
	init: function (element, options) {
		_.extend(this.options, options);

		var options = this.options,
			data = {
				langs: appState.attr('langs')
			};

		data[options.moduleName] = options.doc;

		this.loadView(options.viewpath + options.viewName, data);
	},

	loadView: function (path, data) {
		this.element.html(can.view(path, data));
	},

	'{form} submit': function (el, ev) {
		ev.preventDefault();

		var self = this,
			options = self.options,
			data = this.getDocData(el),
			doc = options.doc;

		doc.attr(data);

		doc.save()
			.done(function (response) {
				options.entity(doc.attr('_id'));

				if (options.setRoute) {
					can.route.attr({'entity_id': doc.attr('_id')});
				}

				self.setNotification('success', options.successMsg);
			})
			.fail(function (response) {
				self.processError(response.responseJSON.err);
			});

	},

	getDocData: function (el) {
		return can.deparam(el.serialize())
	},

	setNotification: function (status, msg) {
		appState.attr('notification', {
			status: status,
			msg: msg
		});
	},

    processError: function (err) {
        var msg, prop;

        if (err.responseJSON || err.responseText) {
            err = err.responseJSON || err.responseText;
        }

        if (err.err) {
            err = err.err;
        }

        if (err.errors) {
        	if (err.errors.title) {
            	msg = err.errors.title.message;
        	} else if (_.isObject(err.errors)) {
        		msg = msg || '';
        		for (prop in err.errors) {
        			if (err.errors.hasOwnProperty(prop) && prop[0] !== '_') {
        				msg += err.errors[prop].message + '\r\n';
        			}
        		}
        	}
        	
        }

        if (!msg) {
            msg = err.message || err.err || err;
        }

        if (! _.isString(msg)) {
            msg = 'Произошла не определенная ошибка на сервере.';
        }

        saError(msg);
    }
});
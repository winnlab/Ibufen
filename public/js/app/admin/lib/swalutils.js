import 'swal'
import _ from 'lodash'

window.saMessage = function(title = '', text = '', type = 'info') {
	swal(title, text, type);
}

window.saConfirm = function (title = '', text = '', options, cb = options) {
	var opts = {
		title: title,
		text: text,
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Да",
		cancelButtonText: "Нет",
		closeOnConfirm: false,
		closeOnCancel: true
	};

	if (_.isObject(options)) {
		_.extend(opts, options);
	}

	swal(opts, cb);
};

window.saError = function (text) {
	saMessage('Ошибка!', text, 'error');
};

window.saSuccess = function(title, text) {
	if(text === undefined) {
		text = title;
		title = 'ОК!';
	}

	saMessage(title, text, 'success');
};
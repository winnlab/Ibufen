import 'can/'
import Edit from 'edit'

// import 'bootstrap-wysihtml5'
import 'summernote'

import appState from 'appState'

export default Edit.extend({
    defaults: {
        viewpath: '/js/app/admin/modules/consultations/views/',

        moduleName: 'consultation',

        successMsg: 'Статья успешно сохранена.',
        errorMsg: 'Ошибка сохранения статьи.',

        removeAnswerMsg: 'Удалить ответ?',

        form: '.setConsultation'
    }
}, {
	init: function (element, options) {
        var self = this;

		_.extend(self.options, options);

        var options = self.options;

        self.module = new can.Map({
            langs: appState.attr('langs')
        });

        self.ensureObject(options.doc, 'age');
        self.ensureObject(options.doc, 'answer', []);
        self.ensureObject(options.doc, 'theme');
        self.ensureObject(options.doc, 'type');
        
        self.module.attr(options.moduleName, options.doc);

        self.module.attr('ages', options.ages);
        self.module.attr('themes', options.themes);
        self.module.attr('types', options.types);

        self.module.attr('addingComment', null);
        self.module.attr('showComments', false);

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

        if(!self.options.doc.attr('_id')) {
            self.options.doc.attr('active', true);
        }

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
                    position: pos
                });
            });
        });
    },

    '.removeAnswer click': function (el) {
        var self = this;
        saConfirm('Удаление ответа', this.options.removeAnswerMsg, {closeOnConfirm: true}, function (isConfirmed) {
            if (isConfirmed) {
                var item = $(el).parents('.answer').data('answer'),
                    answ = self.options.doc.attr('answer'),
                    index = answ.indexOf(item);

                if(index > -1) {
                    answ.splice(index, 1);
                }
            }
        });
    },

    '.addComment click': function (el) {
        this.module.attr('addingComment', !this.module.attr('addingComment'));
    },

    '.confirmComment click': function (el) {
        var self = this,
            doc = self.options.doc;
        can.ajax({
            url: '/admin/user'
        }).done(function (response) {
            var wysiwyg = el.closest('.panel-body').find('textarea'),
                commentText = wysiwyg.code(),
                newComment = {
                    date: Date.now(),
                    text: commentText,
                    specialist: {
                        _id: response.data._id,
                        name: response.data.name
                    }
                };

            doc.attr('answer').push(newComment);

            self.module.attr('addingComment', false);
            wysiwyg.code('');
            saSuccess('Комментарий добавлен! Нажмите "Сохранить", чтобы сохранить добавленный комментарий.');
        }).fail(function (response) {
            saError(response.err || response.responseJSON ? response.responseJSON.err : 'Произошла неизвестная ошибка.' );
        });
    }
});
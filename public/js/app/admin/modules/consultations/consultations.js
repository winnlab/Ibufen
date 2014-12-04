import 'can/'
import List from 'list'

import consultationModel from 'js/app/admin/modules/consultations/consultationModel'
import consultationEdit from 'js/app/admin/modules/consultations/consultation'

import 'articlefilter'

import AgeModel from 'js/app/admin/modules/category/ageModel'
import ArticleTypeModel from 'js/app/admin/modules/articleTypes/articleTypeModel'
import ThemeModel from 'js/app/admin/modules/category/themeModel'

export default List.extend(
	{
		defaults: {
            viewpath: '/js/app/admin/modules/consultations/views/',
            viewName: 'index.stache',

            moduleName: 'consultations',
            Model: consultationModel,

            Edit: consultationEdit,

            add: '.addConsultation',
            edit: '.editConsultation',
            remove: '.removeConsultation',

            formWrap: '.consultationForm',

            parentData: '.consultation'
        }
	}, {
        init: function () {
            var self = this;

            List.prototype.init.call(self);

            self.module.attr('doFilter', new can.Map({exec: self.doFilter.bind(self)})
            );

            self.module.attr('ages', new can.List);
            self.module.attr('themes', new can.List);
            self.module.attr('types', new can.List);

            AgeModel.findAll({active: true}, function (docs) {
                $.each(docs, function(i, doc) {
                    self.module.attr('ages').push(doc);
                });
            });

            ThemeModel.findAll({active: true}, function (docs) {
                $.each(docs, function(i, doc) {
                    self.module.attr('themes').push(doc);
                });
            });

            ArticleTypeModel.findAll({}, function (docs) {
                $.each(docs, function(i, doc) {
                    self.module.attr('types').push(doc);
                });
            });
        },

        initSetControl: function (area, doc, entity) {
            area.html('');

            var params = {
                    ages: this.module.attr('ages'),
                    themes: this.module.attr('themes'),
                    types: this.module.attr('types'),
                    doc,
                    entity
                };

            if (this.options.EditHandle) {
                this.options.EditHandle.destroy();
            }
            
            this.options.EditHandle = new this.options.Edit(area, params);
        },

        doFilter: function (data) {
            var moduleList = this.module.attr(this.options.moduleName),
                filter = {};

            if (data) {
                filter['age._id'] = data.attr('age');
                filter['theme._id'] = data.attr('theme');
                filter['type.name'] = data.attr('type');
            }

            this.module.attr(this.options.moduleName, new this.options.Model.List(filter));
        }
	}
);
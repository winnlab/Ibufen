import 'can/'
import List from 'list'
import _ from 'lodash'
import appState from 'appState'
import 'pagination'
import moment from 'js/plugins/moment/min/moment.min'
import 'swal'

import ClientModel from 'js/app/admin/modules/clients/clientModel'
import Client from 'js/app/admin/modules/clients/client'

export default List.extend(
	{
		defaults: {
            viewpath: '/js/app/admin/modules/clients/views/',
            viewName: 'index.stache',

            moduleName: 'clients',
            Model: ClientModel,

            Edit: Client,

            successMsg: 'Сущность успешно сохранена.',
            errorMsg: 'Ошибка сохранения сущности.',

            add: '.addClient',
            edit: '.editClient',
            remove: '.removeClient',

            formWrap: '.clientForm',

            parentData: '.client',

            limit: 100
        }
	}, 
    {
        init: function () {
            var self = this;

            List.prototype.init.call(self);

            self.module.attr('currentPage', 1);
            self.module.attr('searchString', '');

            self.module.attr('count', self.options.Model.pages);
            self.module.attr('limit', self.options.limit);

            self.module.bind('currentPage', function (ev, newVal, oldVal) {
                if(!self.blocked) {
                    self.populateModel();
                }
            });
        },

        populateModel: function () {
            var o = this.options,
                searchString = this.module.attr('searchString'),
                params = {
                    page: this.module.attr('currentPage') || 1,
                    limit: o.limit
                };

            if (searchString && !_.isEqual(this.oldSearchString, searchString)) {

                this.oldSearchString = searchString;
                params.page = 1;

                can.batch.start();
                this.blocked = true;
                this.module.attr('currentPage', 1);
                this.blocked = false;
                can.batch.stop();

                params.$or = [
                    {'profile.first_name' : searchString},
                    {'profile.last_name' : searchString},
                    {'email' : searchString}
                ];
            }

            this.module.attr(o.moduleName, new o.Model.List(params));
        },

        '.t-do-search click': function () {
            this.populateModel();
        },

        '{remove} click': function (el) {
            var self = this,
                doc = self.getDocHandle(el);
            
            if(!doc.attr('active')) {
                return swal({
                    title: "Уже сделано",
                    text: "Пользователь уже деактивирован!",
                    type: "info"
                });
            }

            swal({
                title: "Деактивация пользователя",
                text: "Вы уверены? Активировать пользователя вручную после выполнения данной операции невозможно.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Продолжай!",
                cancelButtonText: "Нет!",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    can.batch.start();
                    doc.attr('active', false);
                    doc.save()
                        .always(function () {
                            can.batch.stop();
                        })
                        .done(function (response) {
                            if(response.err) {
                                doc.attr('active', true);
                                return self.processError(response.err);
                            }
                            swal("Пользователь деактивирован!", "Мы лишь сделали то, что вы просили...", "success");
                        })
                        .fail(function () {
                            doc.attr('active', true);
                            swal("Упс!", "Произошла ошибка при сохранении. Возможно, у вас отсутствует подключение к сети.", "error");
                        });
                }
            });
        },

        processError: function (err) {
            var msg;

            if(err.errors && err.errors.title) {
                msg = err.errors.title.message;
            }

            if(!msg) {
                msg = err.message || err;
            }

            swal('Упс!', msg, 'error');
        }
    }
);
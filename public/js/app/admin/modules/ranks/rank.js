import 'can/'
import Edit from 'edit'

export default Edit.extend({
    defaults: {
        viewpath: '/js/app/admin/modules/ranks/views/',

        moduleName: 'rank',

        form: '.setRank'
    }
}, {
	init: function () {
		Edit.prototype.init.call(this);

		if(!this.options.doc.attr('_id')) {
            this.options.doc.attr('active', true);
            this.options.doc.attr('prize', new can.List);
		}
	},

    '.addPrize click': function () {
        var self = this,
            prize = new can.Map({
                name: '',
                position: 99,
                image: []
            }),
            doc = self.options.doc;

        can.batch.start();

        doc.attr('prize').push(prize);

        doc.save()
            .always(function () {
                can.batch.stop();
            })
            .fail(function (response) {
                doc.attr('prize').pop();

                self.processError(response.responseJSON.err);
            });
    }
});
import 'can/'

export default can.Control({}, {
    init: function (el, opts) {
        this.element.html(can.view('/js/app/admin/modules/tmpRemoveUser/index.stache'));
    },

    'form submit': function (el, ev) {
        ev.preventDefault();

        var data = el.serialize();

        can.ajax({
            url: '/admin/tmpUserRemove',
            method: 'POST',
            data: data
        }).done(function(response) {
            if (response === true) {
                saSuccess('Удалено!');
            } else {
                saError(response);
            }
        })
    }
});
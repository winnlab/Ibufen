import 'can/'
import 'can/map/backup/'
import 'can/map/validations/'
import appState from 'appState'

var MyMap = can.Map.extend({}, {
	define: {
        page: {
            set: function (val) {
                if (isNaN(+val)) {
                    val = this.attr('oldVal');
                }

                this.attr('oldVal', val)
                return val;
            },
            value: 1
        }
    }
});

can.Component.extend({
	tag: 'pagination',
	template: can.view('/js/app/admin/components/pagination/views/pagination.stache'),
	scope: new MyMap({
		blockBefore: false,
		blockAfter: false,
		pages: function () {
			return  Math.ceil(this.attr('count') / this.attr('limit'));
		},
		tryAdd: function (array, method, pages, value) {
			if(value > 1 && value < pages) {
				array[method](value);
			}
		}
	}),
	helpers: {
		pagesList: function () {
			var range = [],
				pages = this.pages(),
				page = +this.attr('page');

			this.tryAdd(range, 'push', pages, page);

			if(page === 1 || page === pages) {
				var method = page === 1 ? 'push' : 'unshift';
				var step = page === 1 ? 1 : -1;

				this.tryAdd(range, method, pages, page + step);
				this.tryAdd(range, method, pages, page + step * 2);
			} else {
				this.tryAdd(range, 'unshift', pages, page - 1);
				this.tryAdd(range, 'push', pages, page + 1);
			}

			var result = '';
			for(var i = 0, len = range.length; i < len; i++) {
				result += '<li class="pn-page';
				if (page === range[i]) {
					result += ' active';
				}
				result +='" data-page="' + range[i] + '"><a href="#">' 
										 + range[i] + '</a></li>';
			}

			this.attr('blockBefore', page > 3 || pages === 4);
			this.attr('blockAfter', page < pages - 2 || pages === 4);
			return result;
		}
	},
	events: {
		'.pn-next click': function (el) {
			if(el.hasClass('disabled')) return;
			var page = this.scope.attr('page');
			this.scope.attr('page', ++page);
		},

		'.pn-prev click': function (el) {
			if(el.hasClass('disabled')) return;
			var page = this.scope.attr('page');
			this.scope.attr('page', --page);
		},

		'.pn-page click': function (el) {
			this.scope.attr('page', el.data('page'));
		}
	}
});
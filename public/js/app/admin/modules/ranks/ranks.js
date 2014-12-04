import 'can/'
import List from 'list'

import 'upload'

import RankModel from 'js/app/admin/modules/ranks/rankModel'
import Rank from 'js/app/admin/modules/ranks/rank'

export default List.extend(
	{
		defaults: {
            viewpath: '/js/app/admin/modules/ranks/views/',
            viewName: 'index.stache',

            Edit: Rank,

            moduleName: 'ranks',
            Model: RankModel
        }
	},
    {
        '.activateRank click': function (el) {
            this.getDocHandle(el).save();
        }
    }
);
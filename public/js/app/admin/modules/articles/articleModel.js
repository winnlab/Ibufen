import baseModel from 'baseModel'
import can from 'can/'
import _ from 'lodash'

var lastId = can.compute(),
    docsCount = 18,
    resource = baseModel.chooseResource('/article');

export default can.Model.extend(
	{
	    id: '_id',
        lastPageReached: false,
	    parseModel: baseModel.parseModel,
	    parseModels: function (response) {
            var data = response.data || {};

            lastId(data.nextAnchorId);

            if (!data.nextAnchorId || data.documents.length === 0) {
                this.lastPageReached = true;
            }
            return data.documents || [];
        },
        findAll: function (params) {
            if (params === false) {
                params = this.lastParams;
            }

            if (this.lastParams && ! _.isEqual(params.queryOptions.sort, this.lastParams.queryOptions.sort)) {
                this.lastPageReached = false;
            }

            this.lastParams = params;

            if (this.lastPageReached) {
                var def = can.Deferred();
                return def.resolve({data: {documents: []}});
            }
            
            params.queryOptions = params.queryOptions || {};
            params.queryOptions.lastId = lastId();
            params.queryOptions.docsCount = docsCount;

            return $.ajax({
                url: resource,
                method: 'GET',
                data: params
            });
        },
        findOne: resource + '/{id}',
        create: resource,
        update: resource,
        destroy: resource
	}, {
		uploaded: baseModel.simpleUploaded,
		removeUploaded: baseModel.simpleRemoveUploaded
	}
);
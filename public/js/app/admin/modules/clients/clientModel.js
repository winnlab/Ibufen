import baseModel from 'baseModel'
import can from 'can/'

export default can.Model.extend(
	{
	    id: '_id',
	    resource: baseModel.chooseResource('/client'),
	    parseModel: baseModel.parseModel,
	    pages: can.compute(1),
	    parseModels: function (resp) {
	    	this.pages(resp.data.count);
	        return resp.data.data ? resp.data.data : [];
	    }
	}, {
		uploaded: baseModel.simpleUploaded,
		removeUploaded: baseModel.simpleRemoveUploaded
	}
);
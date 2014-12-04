var baseModel = {
    chooseResource: function (resource) {
        return document.location.pathname.indexOf('admin/') !== -1
            ? '/admin' + resource
            : resource;
    },
    parseModel: function (data) {
        return data.data && !data.err ? data.data : data;
    },
    parseModels: function (data) {
        return data.data ? data.data : [];
    },
    simpleUploaded: function (name, value) {
        this.attr(name, value);
    },
    simpleRemoveUploaded: function (name) {
        this.attr(name, undefined);
    },
    uploaded: function (name, response) {
        if (typeof response === 'string') {
            return this.attr(name, response);
        }

        var data = response.data || response.responseJSON || response,
            value = data[name] || data;

        if (!this.attr(name)) {
            this.attr(name, []);
        }

        var images = this.attr(name).attr();

        if (data.__v) {
            this.attr('__v', data.__v);
        }

        if(value instanceof Array){
            value.forEach(function (val){
                images.push(val.name);
             });
            this.attr(name, images);
        } else if(value instanceof Object) {
            images.push(value.name);
            this.attr(name, images);
        } else {
            swal("Ошибка!", "Некорректно задано значение входящих аргументов при загрузке изображений.", "success")
        }
    },
    removeUploaded: function (name, index, response) {
        if (typeof this.attr(name) === 'string') {
            return this.attr(name, undefined);
        }

        var data = response.responseJSON
            ? response.responseJSON.data
            : response.data;

        this.attr(data.name).splice(index, 1);

        if (data.__v) {
            this.attr('__v', data.__v);
        }
    }
};

export default baseModel;
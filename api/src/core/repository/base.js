module.exports = class BaseRepository {
    constructor(Model) {
        this.Model = Model;
    }
    async get(conditions, fields = [], options = {}) {
        // console.log('--get-filters', conditions);
        fields = fields.join(' ');
        try {
            // const error = validateId(conditions, this.Model);
            // if (error) throw error;
            return await this.Model.findOne(conditions, fields, options);
        } catch (error) {
            return this.error(error);
        }
    }
    async search(conditions, fields = [], options = {}) {
        // console.log('--search-filters', conditions);
        fields = fields.join(' ');
        options.limit = options.limit ? parseInt(options.limit) : Utils.constants.PER_PAGE;
        options.page = options.page ? parseInt(options.page) : 1;
        options.skip = (options.page - 1) * options.limit;
        const _options = Utils.functions.pick(options, ['skip', 'limit', 'sort', 'populate', 'lean']);
        try {
            // const error = validateId(conditions, this.Model);
            // if (error) throw error;
            const result = await this.Model.find(conditions, fields, _options);
            const total = await this.Model.countDocuments(conditions);
            const pages = Math.floor(total / options.limit);
            // const pages = total / options.limit;
            return {
                results: result,
                total: total,
                per_page: options.limit,
                current_page: options.page,
                last_page: (total === options.limit * pages) ? Math.max(pages, 1) : pages + 1
                // last_page: (pages % options.limit) == 0 ? pages : pages + 1,
            }
        } catch (error) {
            return this.error(error);
        }
    }
    async create(doc, options = {}) {
        try {
            const model = new this.Model(doc);
            return await model.save(options);
        } catch (error) {
            return this.error(error);
        }
    }
    async update(conditions, doc, options = {}) {
        try {
            // const error = validateId(conditions, this.Model);
            // if (error) throw error;
            if (!options.new) options.new = true;
            return await this.Model.findOneAndUpdate(conditions, { $set: doc }, options);
        } catch (error) {
            return this.error(error);
        }
    }
    async remove(conditions) {
        try {
            const error = validateId(conditions, this.Model);
            if (error) throw error;
            return await this.Model.findOneAndRemove(conditions);
        } catch (error) {
            return this.error(error);
        }
    }
    async bulkCreate(docs, options = {}) {
        // console.log('--inserting many');
        try {
            return await this.Model.insertMany(docs, options);
        } catch (error) {
            return this.error(error);
        }
    }
    async bulkUpdate(conditions, doc, options = {}) {
        try {
            // const error = validateId(conditions, this.Model);
            // if (error) throw error;
            return await this.Model.updateMany(conditions, { $set: doc }, options);
        } catch (error) {
            return this.error(error);
        }
    }
    async bulkRemove(conditions) { //! need to be tested
        try {
            // const error = validateId(conditions, this.Model);
            // if (error) throw error;
            return await this.Model.deleteMany(conditions);
        } catch (error) {
            return this.error(error);
        }
    }
    error(error) {
        // console.log( JSON.parse(JSON.stringify(error)));
        if (error.errmsg) {
            if (error.code && error.code == 11000) {
                error.message = `Duplicate ${Object.keys(error.keyValue)[0]}`,
                    error.errors = {};

            } else {
                Utils.logger(error);
                error.message = `Something wrong check error log`,
                    error.errors = {};
            }
        }
        return error;
    }
}
// check if _id exists in filters & if it's valid
//! what if the user sent multiple ids !!!
function validateId({ _id: id }, model) {
    const notValid = id && !Utils.functions.isObjectId(id);
    if (notValid) return { message: `invalid ${model.modelName} id`, errors: {} };
}
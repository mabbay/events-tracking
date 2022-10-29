module.exports = class Validation extends Core.Validation {
    constructor(data, update = false) {
        super(data, update);
        this.schema = this.Joi.object({
            event: this.Joi.string().required(),
            page: this.Joi.string().required(),
            frequency: this.Joi.number().integer().required(),
            date: this.Joi.date(),
            element: this.Joi.objectId().required() // element id
        });
        this.validate();
    }
}
module.exports = class Validation extends Core.Validation {
    constructor(data, update = false) {
        super(data, update);
        this.schema = this.Joi.object({
            firstName: this.Joi.string().min(3).max(50).required(),
            lastName: this.Joi.string().min(3).max(50).required(),
            email: this.Joi.string().email().max(255),
            password: this.Joi.string().min(6).max(255),
            company: this.Joi.string().max(50), // company name
            role: this.Joi.objectId(),
            isAdmin: this.Joi.boolean()
        });
        this.validate(); // this.error = ... , this.data = ... 
    }
}
module.exports = class Validation extends Core.Validation {
  constructor(data, update = false) {
    super(data, update);
    this.schema = this.Joi.object({
      path: this.Joi.string().required(),
      label: this.Joi.string().max(50),
      website: this.Joi.objectId().required(),
      company: this.Joi.objectId().required(),
      events: this.Joi.array().items(this.Joi.string().max(50))
    });
    this.validate(); // this.error = ... , this.data = ... 
  }
}
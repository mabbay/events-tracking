module.exports = class Validation extends Core.Validation {
  constructor(data, update = false) {
      super(data, update);
      this.schema = this.Joi.object({
          domain: this.Joi.string().max(250).required(),
          company: this.Joi.objectId().required()
      });
      this.validate(); // this.error = ... , this.data = ... 
  }
}
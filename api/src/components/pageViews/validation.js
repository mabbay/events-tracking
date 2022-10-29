module.exports = class Validation extends Core.Validation {
  constructor(data, update = false) {
      super(data, update);
      this.schema = this.Joi.object({
          pagePath: this.Joi.string().required(),
          views: this.Joi.number().integer().required().min(1),
          date: this.Joi.date(),
          website: this.Joi.objectId().required() // website of the page (will be deleted one we will use origin for verification)
      });
      this.validate();
  }
}
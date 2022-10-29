module.exports = class Validation extends Core.Validation {
  constructor(data, update = false) {
      super(data, update);
      this.schema = this.Joi.object({
        name: this.Joi.string().required().max(50)
      });
      this.validate(); // this.error = ... , this.data = ... 
  }
}
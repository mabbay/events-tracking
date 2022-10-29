module.exports = class Validation extends Core.Validation {
  constructor(data, update = false) {
    super(data, update);
    this.schema = this.Joi.object({
      name: this.Joi.string().required().max(50),
      description: this.Joi.string().max(255),
      permissions: this.Joi.array().items(this.Joi.object({
        module: this.Joi.string().required().max(50),
        access: this.Joi.object({
          read: this.Joi.boolean(),
          create: this.Joi.boolean(),
          update: this.Joi.boolean(),
          delete: this.Joi.boolean()
        })
      })),
      company: this.Joi.objectId().required()
    });
    this.validate(); // this.error = ... , this.data = ... 
  }
}
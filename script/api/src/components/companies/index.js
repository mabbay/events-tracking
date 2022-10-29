module.exports = class Controller extends Core.Controller {
  constructor() {
    super('companies');
  }
  // create a company when a user sign up
  async create(req) {
    const { company, firstName } = req.body;
    const name = company ? company : firstName;
    const body = { name };
    return super.create({ body });
  }
}

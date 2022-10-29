module.exports = class Controller extends Core.Controller {

  constructor() {
    super('elements');
  }

  update(req) {
    // takes from the body only the fields we can update
    // req.body = Utils.functions.pick(req.body, ['label', 'events']);
    return super.update(req);
  }

  async delete(req) { //! need to be tested
    if (!req.filters.many) return super.delete(req);
    // we want to delete many elements
    delete req.filters.many;
    return this.deleteMany(req);
  }

  // ! we should make sure the returned value is unique
  generateTarackId() {
    return Math.random().toString(36).substring(2, 12);
  }
}
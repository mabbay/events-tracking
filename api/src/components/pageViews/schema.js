module.exports = class Schema extends Core.Schema {
  constructor() {
    super();
    this.actions = {
      get: ['auth', 'authorize'],
      search: ['auth', 'authorize'],
      create: ['auth', 'authorize'], //TODO need to update scriptUser role
    }
  }
}
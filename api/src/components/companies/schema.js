module.exports = class Schema extends Core.Schema{
  constructor(){
      super();
      // override value affected by super constructor
      this.actions = {
          get: ['auth', 'authorize'],
          update: ['auth', 'authorize']
      }
  }
}
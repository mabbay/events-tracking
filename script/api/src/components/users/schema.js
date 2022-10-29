module.exports = class Schema extends Core.Schema {
    constructor() {
        super();
        // override value affected by super constructor
        this.actions = {
            signup: [], // sign up
            login: [],
            me: ['auth'], // get the current user 
            invite: ['auth', 'authorize'],
            get: ['auth', 'authorize'], // get user(s)
            search: ['auth', 'authorize'],
            update: ['auth', 'authorize'],
            delete: ['auth', 'authorize']
        }
    }
}